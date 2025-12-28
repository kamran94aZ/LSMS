"use strict";

/**
 * Transport Exporter
 * ------------------
 * Exports a Transport Request into a transport package
 */

class ExportTR {

    constructor(repository) {
        this.repository = repository;
    }

    export(tr) {
        const payload = {
            trId: tr.id,
            description: tr.description,
            owner: tr.owner,
            timestamp: new Date(),
            objects: []
        };

        for (const ref of tr.objects) {
            const obj = this.repository.get(ref.type, ref.name);
            if (!obj) {
                throw new Error(`Object not found: ${ref.type} ${ref.name}`);
            }

            payload.objects.push({
                type: obj.type,
                name: obj.name,
                payload: obj.payload
            });
        }

        return payload;
    }
}

module.exports = ExportTR;
