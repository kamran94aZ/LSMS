"use strict";

class LexerRules {
    constructor() {
        this.rules = [
            {
                type: "KEYWORD",
                values: [
                    "REPORT",
                    "WRITE",
                    "IF", "ELSE", "ELSEIF", "ENDIF",
                    "DO", "ENDDO",
                    "WHILE", "ENDWHILE",
                    "LOOP", "ENDLOOP",
                    "CONTINUE", "EXIT", "CHECK",
                    "DATA", "TYPES", "CONSTANTS",
                    "BEGIN", "END", "OF",
                    "SELECT", "FROM", "WHERE", "INTO",
                    "INNER", "LEFT", "RIGHT", "JOIN",
                    "ON", "GROUP", "BY", "ORDER", "HAVING",
                    "CLASS", "ENDCLASS",
                    "METHOD", "METHODS", "ENDMETHOD",
                    "INTERFACE", "ENDINTERFACE",
                    "PUBLIC", "PROTECTED", "PRIVATE",
                    "CREATE", "OBJECT",
                    "AND", "OR", "NOT",
                    "BETWEEN", "IN",
                    "IS", "INITIAL",
                    "FORM", "ENDFORM",
                    "CALL", "FUNCTION", "ENDFUNCTION",
                    "CLEAR", "REFRESH", "DESCRIBE",
                    "TABLE", "LINES"
                ]
            },
            {
                type: "OPERATOR",
                values: [
                    "<=", ">=", "<>", "=>", "->",
                    "=", "<", ">", "+", "-", "*", "/",
                    "(", ")", "[", "]",
                    ",", "."
                ]
            }
        ];
    }

    [Symbol.iterator]() {
        return this.rules[Symbol.iterator]();
    }
}

module.exports = new LexerRules();
