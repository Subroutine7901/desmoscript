import { ATN } from "antlr4ts/atn/ATN.js";
import { CharStream } from "antlr4ts/CharStream.js";
import { Lexer } from "antlr4ts/Lexer.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
export declare class DesmoscriptLexer extends Lexer {
    static readonly T__0 = 1;
    static readonly T__1 = 2;
    static readonly T__2 = 3;
    static readonly T__3 = 4;
    static readonly T__4 = 5;
    static readonly T__5 = 6;
    static readonly T__6 = 7;
    static readonly T__7 = 8;
    static readonly T__8 = 9;
    static readonly T__9 = 10;
    static readonly T__10 = 11;
    static readonly T__11 = 12;
    static readonly T__12 = 13;
    static readonly T__13 = 14;
    static readonly T__14 = 15;
    static readonly T__15 = 16;
    static readonly T__16 = 17;
    static readonly T__17 = 18;
    static readonly T__18 = 19;
    static readonly T__19 = 20;
    static readonly T__20 = 21;
    static readonly T__21 = 22;
    static readonly T__22 = 23;
    static readonly T__23 = 24;
    static readonly T__24 = 25;
    static readonly T__25 = 26;
    static readonly T__26 = 27;
    static readonly T__27 = 28;
    static readonly T__28 = 29;
    static readonly T__29 = 30;
    static readonly T__30 = 31;
    static readonly T__31 = 32;
    static readonly T__32 = 33;
    static readonly T__33 = 34;
    static readonly T__34 = 35;
    static readonly T__35 = 36;
    static readonly T__36 = 37;
    static readonly T__37 = 38;
    static readonly T__38 = 39;
    static readonly T__39 = 40;
    static readonly T__40 = 41;
    static readonly T__41 = 42;
    static readonly T__42 = 43;
    static readonly T__43 = 44;
    static readonly T__44 = 45;
    static readonly T__45 = 46;
    static readonly T__46 = 47;
    static readonly T__47 = 48;
    static readonly STRING = 49;
    static readonly NUMBER = 50;
    static readonly IDENTIFIER_SEGMENT = 51;
    static readonly WS = 52;
    static readonly COMMENT = 53;
    static readonly channelNames: string[];
    static readonly modeNames: string[];
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    constructor(input: CharStream);
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    get channelNames(): string[];
    get modeNames(): string[];
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
