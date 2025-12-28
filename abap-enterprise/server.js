"use strict";

/**
 * ABAP Enterprise Server
 * ---------------------
 * Main entry point
 */

const fs = require("fs");

// ===============================
// LOAD CONFIG
// ===============================
const config = require("./config/config.json");
const dbConfig = require("./config/database.json");
const clusterConfig = require("./config/cluster.json");

// ===============================
// CORE KERNEL
// ===============================
const DDIC = require("./ddic/loader");
const DDICValidator = require("./ddic/validator");

const Repository = require("./cts/repository");
const VersionControl = require("./cts/versionControl");

const Parser = require("./parser/abapParser");
const Interpreter = require("./runtime/interpreter");

const DebugManager = require("./debugger/debugManager");

// ===============================
// OOP / SQL / CTS
// ===============================
const ClassRegistry = require("./oop/classRegistry");
const MetadataProvider = require("./ide/metadata");
const SyntaxChecker = require("./ide/syntaxCheck");

const runProgram = require("./ide/runProgram");

const TransportManager = require("./cts/transportManager");
const TransportMigrator = require("./transport/migrator");

// ===============================
// CLUSTER
// ===============================
let clusterController = null;
if (clusterConfig.enabled) {
    const ClusterController = require("./cluster/controller");
    clusterController = new ClusterController(clusterConfig.nodeId);
    clusterController.start();
}

// ===============================
// INIT DDIC
// ===============================
const ddic = new DDIC("./ddic");
ddic.loadAll();

const ddicValidator = new DDICValidator(ddic);

// ===============================
// INIT REPOSITORY
// ===============================
const repository = new Repository();
const versionControl = new VersionControl();

// ===============================
// INIT RUNTIME
// ===============================
const parser = new Parser();
const interpreter = new Interpreter({
    debug: config.features.debugger
});

// ===============================
// IDE SERVICES
// ===============================
const classRegistry = new ClassRegistry();
const metadata = new MetadataProvider(ddic, classRegistry);
const syntaxChecker = new SyntaxChecker(parser);

// ❗ runProgram BURADA YENİDƏN YARADILMIR
// ❗ Çünki ide/runProgram.js artıq `new RunProgram()` export edir

// ===============================
// CTS / TRANSPORT
// ===============================
const transportManager = new TransportManager(repository, versionControl);
const transportMigrator = new TransportMigrator(
    repository,
    repository,
    versionControl
);

// ===============================
// API SERVER
// ===============================
const createServer = require("./api/server");

const app = createServer({
    runProgram,         
    metadata,
    ddic,
    syntaxChecker,
    transportManager,
    transportMigrator,
    debugManager: DebugManager
});

// ===============================
// START HTTP SERVER
// ===============================
app.listen(config.server.port, config.server.host, () => {
    console.log("========================================");
    console.log(" ABAP ENTERPRISE SERVER STARTED ");
    console.log(" Environment :", config.system.environment);
    console.log(" HTTP Port   :", config.server.port);
    console.log(" Cluster     :", clusterConfig.enabled);
    console.log("========================================");
});
