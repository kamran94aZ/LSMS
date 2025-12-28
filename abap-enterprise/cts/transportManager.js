"use strict";

/**
 * CTS Transport Manager
 * ---------------------
 * Creates and manages Transport Requests (TR)
 *
 * SAP equivalent:
 * - Transport Organizer
 */

class TransportManager {

    constructor(repository, versionControl) {
        this.repository = repository;
        this.versionControl = versionControl;

        // trId -> TR object
        this.transports = Object.create(null);
        this.nextId = 1;
    }

    createTR(owner, description = "") {
        const id = `TR${this.nextId++}`;
        this.transports[id] = {
            id,
            owner,
            description,
            objects: [],   // { type, name }
            status: "CREATED",
            createdAt: new Date()
        };
        return this.transports[id];
    }

    addObject(trId, type, name, commitMessage = "") {
        const tr = this.transports[trId];
        if (!tr) throw new Error(`TR not found: ${trId}`);
        if (tr.status !== "CREATED") {
            throw new Error(`TR not editable: ${trId}`);
        }

        const obj = this.repository.get(type, name);
        if (!obj) throw new Error(`Object not found: ${type} ${name}`);

        // version snapshot
        this.versionControl.commit(type, name, obj.payload, commitMessage);

        tr.objects.push({ type, name });
    }

    releaseTR(trId) {
        const tr = this.transports[trId];
        if (!tr) throw new Error(`TR not found: ${trId}`);
        tr.status = "RELEASED";
        tr.releasedAt = new Date();
        return tr;
    }

    getTR(trId) {
        return this.transports[trId] || null;
    }
}

module.exports = TransportManager;
