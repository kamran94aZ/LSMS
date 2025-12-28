"use strict";

const ABAPInterpreter = require("../runtime/interpreter");

class RunProgram {

    async run(source, input) {
        const interpreter = new ABAPInterpreter();
        return await interpreter.run(source);
    }
}

module.exports = new RunProgram();
