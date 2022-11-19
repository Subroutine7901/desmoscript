import {
  DesmoscriptCompilationUnit,
  DesmoscriptCompileContext,
  Scope,
  ScopeContent,
} from "../semantic-analysis/analysis-types.mjs";

import { ExpressionState, expressionStateParser, GrapherStateParser, GraphState, tickerParser } from "../graphstate.mjs";
import {
  ASTBinop,
  ASTExpr,
  ASTFunctionDef,
  ASTIdentifier,
  ASTJSON,
  ASTNote,
  ASTType,
  JSONType,
  RawASTExpr,
} from "../ast/ast.mjs";
import { err } from "../semantic-analysis/analyze-first-pass.mjs";
import { ASTVisitorLUT, noOpLUT, visitAST } from "../ast/ast-visitor.mjs";
import {
  findIdentifier,
  getCanonicalPath,
  getInnerScopeOfExpr,
  getScopeOfExpr,
} from "../semantic-analysis/analyze-utils.mjs";
import { determineNamespaceSeparator } from "./determine-namespace-separator.mjs";

import * as fs from "node:fs/promises";

let exprIdCounter = 0;
function uniqueExpressionID() {
  return (exprIdCounter++).toString();
}

function opToLatex<T>(expr: ASTBinop<T>) {
  const lop: string | undefined = optable[expr.op];
  if (!lop)
    throw {
      expr,
      reason: `Unable to convert operator '${expr.op}'. Contact a developer if this error occurs.`,
    };
  return lop;
}

function toDesmosVar(str: string) {
  if (str.length == 1) return str;
  return `${str[0]}_{${str.slice(1)}}`;
}

function lastof<T>(arr: T[]) {
  return arr[arr.length - 1];
}

const optable: { [key: string]: string } = {
  "+": "+",
  "-": "-",
  "*": "\\cdot ",
  ">": "\\gt ",
  "<": "\\lt ",
  ">=": "\\ge ",
  "<=": "\\le ",
  "->": "\\to ",
  "..": "...",
  "=": "=",
  "==": "=",
};

let currentExprID = 0;
function getGraphExprID() {
  return (currentExprID++).toString();
}

const dummyExpr: ASTNote<{}> = { line: 0, col: 0, file: ".", id: -1, type: ASTType.NOTE, text: "dummy" };
function createVariableName(
  compileContext: DesmoscriptCompileContext,
  unit: string,
  path: string[],
  name: string,
) {
  const unitVarNameSegment = compileContext.compilationUnitPrefixes.get(unit);
  if (!unitVarNameSegment) err(dummyExpr, "INTERNAL ERROR: No corresponding file prefix.");
  return [unitVarNameSegment, ...path, name].join(compileContext.namespaceSeparator);
}

function makeDesmosVarName(
  compileContext: DesmoscriptCompileContext,
  unit: string,
  path: string[],
  name: string,
) {
  return toDesmosVar(createVariableName(compileContext, unit, path, name));
}

/*
How do I make this completely resistant to namespace collisions?

Also, how do I create sensible names for everything?

Here's my thought: To completely disambiguate everything, I need a
namespace separator that isn't used anywhere. I also need a way of
disambiguating stuff with the same name in different files.

How can I do this?

Here's every possible name:
- all file names, possilby with some suffix to avoid duplicate file names
- all identifier segments
- so I need to enumerate a set of all of these to generate a namespace separator
- how to actually refer to a variable?
  1. file path
  2. namespace path (from original file)
  3. variable name

Another problem: handling imported macros and keeping the scope
tree current. I'll get around this by creating a custom scopetree
type for imports.
*/
async function compileExpression(
  props: {
    ctx: DesmoscriptCompileContext;
    unit: DesmoscriptCompilationUnit;
    graphState: GraphState;
  },
  rootExpr: RawASTExpr<{}>
) {
  const { ctx, unit, graphState } = props;

  const u = undefined;
  const lut: ASTVisitorLUT<{}, any, string> = {
    // unhandled variants
    json(e,c,v) { return "" },
    decorator(e,c,v) { return "" },
    note(e,c,v) { return "" },
    named_json(e,c,v) { return "" },
    async all(e,c) {  },

    // handled variants
    number(e, c, v) {
      return e.number.toString();
    },

    binop(e, c, v) {
      const lc = v(e.left, u);
      const rc = v(e.right, u);
      if (e.op == "^") return `${lc}^{${rc}}`;
      if (e.op == "[") return `${lc}\\left[${rc}\\right]`;
      if (e.op == "/") return `\\frac{${lc}}{${rc}}`;
      if (e.op == "%") return `\\operatorname{mod}\\left(${lc},${rc}\\right)`;
      if (e.op == "=") return `${lc}${opToLatex(e)}${rc}`;
      if (e.op == "..") return `\\left[${lc}${opToLatex(e)}${rc}\\right]`;
      if ([">", "<", ">=", "<=", "=="].indexOf(e.op) != -1) {
        return `${lc}${opToLatex(e)}${rc}`;
      }
      return `\\left(${lc}${opToLatex(e)}${rc}\\right)`;
    },

    root(e, c, v) {
      err(e, "This should not be an expression!");
    },

    identifier(e, c, v) {
      const myScope = getScopeOfExpr(e, unit);

      const foundIdentifier = findIdentifier(
        myScope,
        ctx,
        unit.filePath,
        e.segments,
        e        
      );

      if (!foundIdentifier)
        err(e, `'${e.segments.join(".")}' does not exist in this scope.`);

      const varName = createVariableName(
        ctx,
        foundIdentifier.unit,
        getCanonicalPath(foundIdentifier.enclosingScope),
        lastof(e.segments)
      );

      return toDesmosVar(varName);
    },

    point(e, c, v) {
      return `\\left(${v(e.x, u)}, ${v(e.y, u)}\\right)`;
    },

    fncall(e, c, v) {
      return `${v(e.name, u)}\\left(${e.args
        .map((arg) => v(arg, u))
        .join(",")}\\right)`;
    },

    list(e, c, v) {
      return `\\left[${e.elements.map((expr) => v(expr, u)).join(",")}\\right]`;
    },

    step_range(e, c, v) {
      return `\\left[${v(e.left, u)},${v(e.step, u)}...${v(
        e.right,
        u
      )}\\right]`;
    },

    fndef(e, c, v) {
      err(e, "Function definitions should not be here!");
    },

    namespace(e, c, v) {
      err(e, "Namespaces should not be here!");
    },

    block(e, c, v) {
      return v(lastof(e.bodyExprs), u);
    },

    match(e, c, v) {
      return (
        `\\left\\{` +
        `${e.branches
          .map(([predicate, result]) => `${v(predicate, u)}: ${v(result, u)}`)
          .join(",")}` +
        `${e.fallback ? `, ${v(e.fallback, u)}` : ""}` +
        `\\right\\}`
      );
    },

    import(e, c, v) {
      err(e, "Imports should not be here!");
    },

    listcomp(e, c, v) {
      const scopeChain = getCanonicalPath(getInnerScopeOfExpr(e, unit));
      return `\\left[${v(e.body, c)}\\operatorname{for}${e.variables
        .map(([varname, list]) => {
          `${
            makeDesmosVarName(ctx, unit.filePath, scopeChain, varname)
          }=${c(list)}`;
        })
        .join(",")}\\right]`;
    },

    sumprodint(e, v, c) {
      const scopeChain = getCanonicalPath(getInnerScopeOfExpr(e, unit));
      const counterVarName = makeDesmosVarName(ctx, unit.filePath, scopeChain, e.varName);
      if (e.opType == "integral") {
          return `\\left(\\int_{${c(e.lo,v)}}^{${c(e.hi,v)}}\\left(${c(e.body,v)}\\right)d${counterVarName}\\right)`;
      } else {
          let op = (e.opType == "product") ? "prod" : "sum"
          return `\\left(\\${op}_{${counterVarName}=${c(e.lo,v)}}^{${c(e.hi,v)}}\\left(${c(e.body,v)}\\right)\\right)`;
      }
    },

    derivative(e, c, v) {
      const scopeChain = getCanonicalPath(getInnerScopeOfExpr(e, unit));
      const varname = makeDesmosVarName(ctx, unit.filePath, scopeChain, e.variable);
      return `\\left(\\frac{d}{d${varname}}\\left(${v(e.body,c)}\\right)\\right)`;
    },

    memberaccess(e, c, v) { 
      return `${v(e.left,c)}.${e.right}`;
    },

    actions(e, c, v) {
      return e.actions.map(([l, r]) => `${v(l,c)}\\to ${v(r,c)}`)
      .concat(e.actionAliases.map(a => v(a,c)))
      .join(",");
    }
  };

  return visitAST(rootExpr, lut, ctx);
}
async function compileFunctionDefinition(
  props: {
    ctx: DesmoscriptCompileContext;
    unit: DesmoscriptCompilationUnit;
    graphState: GraphState;
  },
  rootExpr: ASTFunctionDef<{}>,
  finalExpr: ASTExpr
) {
  const { ctx, unit, graphState } = props;
  const compiledFinalExpr = compileExpression(props, finalExpr);
  const fnNameVar = makeDesmosVarName(
    ctx, 
    unit.filePath, 
    getCanonicalPath(getScopeOfExpr(rootExpr, unit)), 
    rootExpr.name
  );
  const argScopePath = getCanonicalPath(getInnerScopeOfExpr(rootExpr, unit));
  const fnArgsVars = rootExpr.args.map(arg => makeDesmosVarName(
    ctx,
    unit.filePath,
    argScopePath,
    arg
  ));
  return `${fnNameVar}\\left(${fnArgsVars.join(",")}\\right)=${await compiledFinalExpr}`;
}


function compileJSONExpression(
  props: {
    ctx: DesmoscriptCompileContext;
    unit: DesmoscriptCompilationUnit;
    graphState: GraphState;
  },
  expr: ASTJSON<{}>) {
  function c(e: ASTJSON<{}>): any {
      switch (e.data.jsontype) {
      case JSONType.NUMBER:
      case JSONType.STRING:
      case JSONType.NULL:
      case JSONType.BOOLEAN:
          return e.data.data;
      case JSONType.OBJECT:
          return Object.fromEntries(Object.entries(e.data.data)
              .map(([k,v]): [string, any] => [k, c(v)]));
      case JSONType.ARRAY:
          return e.data.data.map(e => c(e));
      case JSONType.DESMOSCRIPT:
          return compileExpression(props, e.data.data);
      }
  }

  return c(expr);
}

async function compileScope(
  props: {
    ctx: DesmoscriptCompileContext;
    unit: DesmoscriptCompilationUnit;
    graphState: GraphState,
  },
  scope: Scope
) {
  const { ctx, unit, graphState } = props;

  for (let [name, c] of scope.contents) {
    switch (c.type) {
      case ScopeContent.Type.VARIABLE:
        {
          if (c.isBuiltin) break;
          const latex = await compileExpression(props, c.data);
          let additionalProperties: Partial<ExpressionState> = {};
          if (c.decoratorInfo) {
            additionalProperties = expressionStateParser.parse(
              compileJSONExpression(props, c.decoratorInfo.json)
            );
          }
          graphState.expressions.list.push({
            type: "expression",
            latex,
            id: getGraphExprID(),
            color: "black",
            ...additionalProperties
          });
          break;
        }
      case ScopeContent.Type.FUNCTION:
        {
          if (c.isBuiltin) break;
          const latex = await compileFunctionDefinition(props, c.data, c.finalExpr);
          graphState.expressions.list.push({
            type: "expression",
            latex,
            id: getGraphExprID(),
            color: "black"
          })
          break;
        }
      case ScopeContent.Type.NAMED_JSON:
        {
          const json = compileJSONExpression(props, c.data);
          if (c.name == "settings") {
            const parsedJSON = GrapherStateParser.parse(json);
            graphState.graph = parsedJSON;
          } else if (c.name == "ticker") {
            const parsedJSON = tickerParser.parse(json);
            graphState.expressions.ticker = parsedJSON;
          }
        }
        break;
      case ScopeContent.Type.SCOPE:
        compileScope(props, c.data);
        break;
      case ScopeContent.Type.NOTE:
        graphState.expressions.list.push({
          type: "text",
          text: c.data,
          id: getGraphExprID(),
        });
    }
  }
}

async function compileCompilationUnit(
  props: {
    ctx: DesmoscriptCompileContext,
    unit: DesmoscriptCompilationUnit,
    graphState: GraphState
  }
) {
  await compileScope(props, props.unit.rootScope);
}

export async function compile(ctx: DesmoscriptCompileContext) {
  const graphState: GraphState = {
    version: 9,
    graph: {
      viewport: { xmin: -10, ymin: -10, xmax: 10, ymax: 10 },
    },
    expressions: {
      list: [],
    },
  };

  determineNamespaceSeparator(ctx);

  for (const [unitName, unit] of ctx.compilationUnits) {
    await compileCompilationUnit({
      ctx,
      unit,
      graphState,
    });
  }

  return graphState;
}
