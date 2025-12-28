"use strict";

/**
 * DDIC Validator
 * --------------
 * Validates values against DOMAIN and DATA ELEMENT definitions
 *
 * SAP equivalent:
 * - DDIC check framework
 */

class DDICValidator {

    constructor(ddic) {
        this.ddic = ddic;
    }

    /* =====================================================
     * VALIDATE FIELD VALUE
     * ===================================================== */

    validateField(tableName, fieldName, value) {
        const table = this.ddic.getTable(tableName);
        if (!table) {
            throw new Error(`DDIC: Table not found: ${tableName}`);
        }

        const field = table.fields[fieldName.toUpperCase()];
        if (!field) {
            throw new Error(`DDIC: Field not found: ${fieldName}`);
        }

        // Resolve data element
        const elementName = field.element;
        const element = this.ddic.getElement(elementName);
        if (!element) {
            throw new Error(`DDIC: Data element not found: ${elementName}`);
        }

        // Resolve domain
        const domain = this.ddic.getDomain(element.domain);
        if (!domain) {
            throw new Error(`DDIC: Domain not found: ${element.domain}`);
        }

        // Run domain validation
        this._validateDomain(domain, value, field.notNull);
    }

    /* =====================================================
     * DOMAIN VALIDATION
     * ===================================================== */

    _validateDomain(domain, value, notNull = false) {

        // NOT NULL check
        if (notNull && (value === null || value === undefined)) {
            throw new Error(`DDIC: Value required for domain ${domain.name}`);
        }

        // NULL allowed
        if (value === null || value === undefined) {
            return;
        }

        // Type check
        switch (domain.baseType) {

            case "CHAR":
                if (typeof value !== "string") {
                    throw new Error(`DDIC: CHAR expected for ${domain.name}`);
                }

                if (value.length > domain.length) {
                    throw new Error(
                        `DDIC: Value too long for ${domain.name} (max ${domain.length})`
                    );
                }

                if (!domain.lowercase && value !== value.toUpperCase()) {
                    throw new Error(
                        `DDIC: Lowercase not allowed for ${domain.name}`
                    );
                }
                break;

            case "NUMC":
                if (!/^[0-9]+$/.test(String(value))) {
                    throw new Error(`DDIC: NUMC expected for ${domain.name}`);
                }
                break;

            default:
                throw new Error(
                    `DDIC: Unsupported domain type ${domain.baseType}`
                );
        }

        // Value range
        if (domain.valueRange && !domain.valueRange.includes(value)) {
            throw new Error(
                `DDIC: Value ${value} not allowed for domain ${domain.name}`
            );
        }
    }
}

module.exports = DDICValidator;
