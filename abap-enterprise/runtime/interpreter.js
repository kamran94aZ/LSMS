"use strict";

const LexerRules = require("../parser/lexerRules");

class Interpreter {
    async run(source) {
        const lexerRules = LexerRules;
        const output = [];
        let pos = 0;

        while (pos < source.length) {
            const char = source[pos];

            if (/\s/.test(char)) {
                pos++;
                continue;
            }

            if (/[A-Za-z]/.test(char)) {
                let word = "";
                while (pos < source.length && /[A-Za-z0-9_]/.test(source[pos])) {
                    word += source[pos++];
                }

                if (word.toUpperCase() === "WRITE") {
                    while (/\s/.test(source[pos])) pos++;

                    if (source[pos] !== "'") {
                        throw new Error("WRITE expects string literal");
                    }

                    pos++;
                    let value = "";
                    while (pos < source.length && source[pos] !== "'") {
                        value += source[pos++];
                    }
                    pos++;

                    while (/\s/.test(source[pos])) pos++;

                    if (source[pos] !== ".") {
                        throw new Error("Missing '.' after WRITE");
                    }

                    pos++;
                    output.push(value);
                    continue;
                }

                continue;
            }

            pos++;
        }

        return {
            success: true,
            output
        };
    }
}

module.exports = Interpreter;
