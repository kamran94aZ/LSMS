"use strict";

/**
 * ABAP Enterprise Kernel – Type System
 * -----------------------------------
 * Simulates ABAP data types and conversions
 *
 * SAP equivalent:
 * - ABAP Dictionary Type Kernel
 * - Runtime Type Services (RTTS)
 */

class ABAPTypes {

    /* =====================================================
     * PRIMITIVE TYPES
     * ===================================================== */

    static initial(type, length = null) {
        switch (type) {
            case "I":       // Integer
                return 0;
            case "F":       // Float
                return 0.0;
            case "C":       // Character
                return length ? " ".repeat(length) : "";
            case "N":       // Numeric text
                return length ? "0".repeat(length) : "";
            case "STRING":
                return "";
            case "XSTRING":
                return Buffer.alloc(0);
            default:
                throw new Error(`Unknown ABAP type: ${type}`);
        }
    }

    /* =====================================================
     * TYPE CHECKING
     * ===================================================== */

    static validate(type, value, length = null) {

        if (value === null || value === undefined) {
            return this.initial(type, length);
        }

        switch (type) {
            case "I":
                return parseInt(value, 10) || 0;

            case "F":
                return parseFloat(value) || 0.0;

            case "C":
                value = String(value);
                if (length) {
                    return value.padEnd(length, " ").substring(0, length);
                }
                return value;

            case "N":
                value = String(value).replace(/\D/g, "");
                if (length) {
                    return value.padStart(length, "0").substring(0, length);
                }
                return value;

            case "STRING":
                return String(value);

            case "XSTRING":
                if (Buffer.isBuffer(value)) return value;
                return Buffer.from(String(value));

            default:
                throw new Error(`Invalid ABAP type: ${type}`);
        }
    }

    /* =====================================================
     * STRUCTURE TYPE
     * ===================================================== */

    static createStructure(definition) {
        const struct = Object.create(null);

        for (const field of definition) {
            struct[field.name] = this.initial(field.type, field.length);
        }

        return struct;
    }

    static assignStructure(target, source, definition) {
        for (const field of definition) {
            if (field.name in source) {
                target[field.name] =
                    this.validate(field.type, source[field.name], field.length);
            }
        }
        return target;
    }

    /* =====================================================
     * INTERNAL TABLE TYPE
     * ===================================================== */

    static createTable(lineTypeDef) {
        return {
            __abapTable: true,
            lineType: lineTypeDef,
            rows: []
        };
    }

    static append(table, row) {
        if (!table.__abapTable) {
            throw new Error("Not an ABAP internal table");
        }

        const newRow = this.createStructure(table.lineType);
        this.assignStructure(newRow, row, table.lineType);

        table.rows.push(newRow);
        return table.rows.length;
    }

    /* =====================================================
     * TYPE CONVERSION
     * ===================================================== */

    static convert(value, targetType, length = null) {
        return this.validate(targetType, value, length);
    }

    /* =====================================================
     * RTTI / METADATA
     * ===================================================== */

    static describe(value) {
        if (Array.isArray(value)) {
            return { kind: "TABLE", lines: value.length };
        }
        if (typeof value === "object") {
            return { kind: "STRUCTURE", fields: Object.keys(value) };
        }
        return { kind: typeof value };
    }
}

module.exports = ABAPTypes;
