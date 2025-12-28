"use strict";

/**
 * ABAP Enterprise Kernel – Event System
 * ------------------------------------
 * Implements ABAP event handling
 *
 * SAP equivalent:
 * - ABAP Objects Event Kernel
 * - Observer pattern
 */

class EventEngine {

    constructor() {
        // eventName -> array of handlers
        this.handlers = Object.create(null);
    }

    /* =====================================================
     * REGISTER EVENT HANDLER
     * ===================================================== */

    /**
     * Register event handler
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object|null} instance (optional)
     */
    register(eventName, handler, instance = null) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }

        this.handlers[eventName].push({
            handler,
            instance
        });
    }

    /* =====================================================
     * UNREGISTER HANDLER
     * ===================================================== */

    unregister(eventName, handler) {
        if (!this.handlers[eventName]) return;

        this.handlers[eventName] = this.handlers[eventName]
            .filter(h => h.handler !== handler);
    }

    /* =====================================================
     * RAISE EVENT
     * ===================================================== */

    async raise(eventName, payload = {}, sender = null) {
        const list = this.handlers[eventName];
        if (!list) return;

        for (const h of list) {
            // Instance-bound handler check
            if (h.instance && sender && h.instance !== sender) {
                continue;
            }

            await h.handler(payload, sender);
        }
    }

    /* =====================================================
     * DEBUG SUPPORT
     * ===================================================== */

    dump() {
        const out = {};
        for (const e in this.handlers) {
            out[e] = this.handlers[e].length;
        }
        return out;
    }
}

module.exports = EventEngine;
