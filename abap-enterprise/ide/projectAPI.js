"use strict";

/**
 * IDE Project API
 * ---------------
 * Exposes repository structure to IDE
 */

class ProjectAPI {

    constructor(repository) {
        this.repo = repository;
    }

    listObjectTypes() {
        return Object.keys(this.repo.objects);
    }

    listObjects(type) {
        return this.repo.list(type);
    }

    getObject(type, name) {
        return this.repo.get(type, name);
    }
}

module.exports = ProjectAPI;
