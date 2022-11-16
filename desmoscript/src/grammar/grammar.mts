// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "statement_list$ebnf$1", "symbols": ["statement"]},
    {"name": "statement_list$ebnf$1", "symbols": ["statement_list$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "statement_list", "symbols": ["statement_list$ebnf$1"]},
    {"name": "expression", "symbols": ["number"]},
    {"name": "expression", "symbols": ["binop"]},
    {"name": "expression", "symbols": [{"literal":"("}, "expression", {"literal":")"}]},
    {"name": "expression", "symbols": ["fncall"]},
    {"name": "expression", "symbols": ["action_list"]},
    {"name": "statement", "symbols": ["assignment"]},
    {"name": "statement", "symbols": ["namespace"]},
    {"name": "statement", "symbols": ["fndef"]},
    {"name": "assignment", "symbols": ["ident", {"literal":"="}, "expression", {"literal":";"}]},
    {"name": "namespace$string$1", "symbols": [{"literal":"n"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "namespace$ebnf$1", "symbols": []},
    {"name": "namespace$ebnf$1", "symbols": ["namespace$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "namespace", "symbols": ["namespace$string$1", {"literal":"{"}, "namespace$ebnf$1", {"literal":"}"}]},
    {"name": "fndef$string$1", "symbols": [{"literal":"f"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "fndef$ebnf$1", "symbols": []},
    {"name": "fndef$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "ident"]},
    {"name": "fndef$ebnf$1", "symbols": ["fndef$ebnf$1", "fndef$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fndef", "symbols": ["fndef$string$1", {"literal":"("}, "ident", "fndef$ebnf$1", {"literal":")"}, "expression"]},
    {"name": "action$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "action", "symbols": ["ident_chain", "action$string$1", "expression"]},
    {"name": "action_list$ebnf$1", "symbols": []},
    {"name": "action_list$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "action"]},
    {"name": "action_list$ebnf$1", "symbols": ["action_list$ebnf$1", "action_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "action_list", "symbols": ["action", "action_list$ebnf$1"]},
    {"name": "ident_chain$ebnf$1", "symbols": []},
    {"name": "ident_chain$ebnf$1$subexpression$1", "symbols": [{"literal":"."}, "ident"]},
    {"name": "ident_chain$ebnf$1", "symbols": ["ident_chain$ebnf$1", "ident_chain$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ident_chain", "symbols": ["ident", "ident_chain$ebnf$1"]},
    {"name": "fncall$subexpression$1", "symbols": []},
    {"name": "fncall$subexpression$1$ebnf$1", "symbols": []},
    {"name": "fncall$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expression"]},
    {"name": "fncall$subexpression$1$ebnf$1", "symbols": ["fncall$subexpression$1$ebnf$1", "fncall$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fncall$subexpression$1", "symbols": ["expression", "fncall$subexpression$1$ebnf$1"]},
    {"name": "fncall", "symbols": ["ident_chain", {"literal":"("}, "fncall$subexpression$1", {"literal":")"}]},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "block", "symbols": [{"literal":"{"}, "block$ebnf$1", "expression", {"literal":"}"}]},
    {"name": "listcomp$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": (d) => d.join('')},
    {"name": "listcomp$ebnf$1", "symbols": ["assignment"]},
    {"name": "listcomp$ebnf$1", "symbols": ["listcomp$ebnf$1", "assignment"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "listcomp", "symbols": [{"literal":"["}, "expression", "listcomp$string$1", "listcomp$ebnf$1", {"literal":"]"}]},
    {"name": "math_binop", "symbols": ["sum"]},
    {"name": "sum$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "sum$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "sum", "symbols": ["sum", "sum$subexpression$1", "product"]},
    {"name": "sum", "symbols": ["product"]},
    {"name": "product$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "product$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "product$subexpression$1", "symbols": [{"literal":"%"}]},
    {"name": "product", "symbols": ["product", "product$subexpression$1", "exp"]},
    {"name": "product", "symbols": ["exp"]},
    {"name": "exp", "symbols": ["expression", {"literal":"^"}, "exp"]},
    {"name": "exp", "symbols": ["expression"]},
    {"name": "logic_binop$subexpression$1$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "logic_binop$subexpression$1", "symbols": ["logic_binop$subexpression$1$string$1"]},
    {"name": "logic_binop$subexpression$1$string$2", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "logic_binop$subexpression$1", "symbols": ["logic_binop$subexpression$1$string$2"]},
    {"name": "logic_binop$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "logic_binop$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "logic_binop$subexpression$1$string$3", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "logic_binop$subexpression$1", "symbols": ["logic_binop$subexpression$1$string$3"]},
    {"name": "logic_binop$subexpression$1$string$4", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "logic_binop$subexpression$1", "symbols": ["logic_binop$subexpression$1$string$4"]},
    {"name": "logic_binop", "symbols": ["expression", "logic_binop$subexpression$1", "expression"]},
    {"name": "binop", "symbols": ["math_binop"]},
    {"name": "binop", "symbols": ["logic_binop"]},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$1"]},
    {"name": "number$ebnf$2", "symbols": []},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$3", "symbols": ["number$ebnf$3", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$2", {"literal":"."}, "number$ebnf$3"]},
    {"name": "number$ebnf$4", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$4", "symbols": ["number$ebnf$4", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number$ebnf$5", "symbols": []},
    {"name": "number$ebnf$5", "symbols": ["number$ebnf$5", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$4", {"literal":"."}, "number$ebnf$5"]},
    {"name": "ident$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ident", "symbols": ["ident$ebnf$1"]},
    {"name": "whitespace$ebnf$1", "symbols": [/[\r\n\t ]/]},
    {"name": "whitespace$ebnf$1", "symbols": ["whitespace$ebnf$1", /[\r\n\t ]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "whitespace", "symbols": ["whitespace$ebnf$1"], "postprocess": 
        (d, l, reject) => null
        }
  ],
  ParserStart: "statement_list",
};

export default grammar;
