"use strict";

/**
 * ABAP Enterprise Runtime – Runtime Context
 * ----------------------------------------
 * Central runtime session container
 *
 * SAP equivalent:
 * - Internal Session
 * - Roll Area
 */

const KernelUtils = require("../kernel/kernelUtils");
const Environment = require("../kernel/environment");
const Types = require("../kernel/types");
const TableEngine = require("../kernel/tableEngine");

// Runtime subsystems
const SQLEngine = require("./sqlEngine");
const ClassRegistry = require("./classRegistry");

class RuntimeContext {

    constructor() {
        /* =========================================
         * CORE MEMORY AREAS
         * ========================================= */

        this.variables = Object.create(null); // DATA
        this.tables = Object.create(null);    // internal tables
        this.types = new Types();              // TYPE system
        this.env = new Environment();          // sy-*
        this.output = [];                      // WRITE buffer

        /* =========================================
         * ENTERPRISE SUBSYSTEMS
         * ========================================= */

        this.sqlEngine = new SQLEngine(this);
        this.classRegistry = new ClassRegistry(this);

        /* =========================================
         * DEBUG / CONTROL
         * ========================================= */

        this.callStack = [];
        this.debug = false;
    }

    /* =====================================================
     * INITIALIZATION
     * ===================================================== */

    init(input = {}) {
        // Selection screen parameters
        for (const k in input) {
            this.variables[k] = KernelUtils.deepClone(input[k]);
        }

        // Reset system fields
        this.env.reset();
    }

    /* =====================================================
     * VARIABLES (DATA)
     * ===================================================== */

    declareVariable(name, type, length = null) {
        const initial = this.types.initialValue(type, length);
        this.variables[name] = initial;
    }

    resolve(name) {
        if (name in this.variables) {
            return this.variables[name];
        }
        if (name in this.tables) {
            return this.tables[name];
        }
        throw new Error(`Variable not found: ${name}`);
    }

    assign(name, value) {
        if (name in this.variables) {
            this.variables[name] = KernelUtils.deepClone(value);
            return;
        }
        if (name in this.tables) {
            this.tables[name] = KernelUtils.deepClone(value);
            return;
        }
        throw new Error(`Assignment target not found: ${name}`);
    }

    /* =====================================================
     * INTERNAL TABLES
     * ===================================================== */

    declareTable(name, rowType = null) {
        this.tables[name] = {
            rows: [],
            rowType
        };
    }

    /* =====================================================
     * TYPES (DDIC-LIKE)
     * ===================================================== */

    registerType(name, fields) {
        this.types.registerStructure(name, fields);
    }

    /* =====================================================
     * CALL STACK (DEBUGGER)
     * ===================================================== */

    pushStack(frame) {
        this.callStack.push(frame);
    }

    popStack() {
        this.callStack.pop();
    }

    /* =====================================================
     * DEBUG HELPERS
     * ===================================================== */

    dumpState() {
        return {
            variables: KernelUtils.deepClone(this.variables),
            tables: KernelUtils.deepClone(this.tables),
            env: this.env.dump(),
            stackDepth: this.callStack.length
        };
    }
}

module.exports = RuntimeContext;
