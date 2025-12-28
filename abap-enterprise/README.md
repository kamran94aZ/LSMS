# ABAP Enterprise Runtime

ABAP Enterprise Runtime is a lightweight ABAP execution engine built on Node.js.
It allows writing and executing ABAP-like programs and returning structured JSON output,
forming the foundation for building Fiori-like web applications without SAP dependency.

---

## Motivation

ABAP is traditionally bound to SAP systems and GUI-based environments.
The purpose of this project is to reimplement core ABAP runtime concepts in a modern,
web-oriented architecture.

Goals of the project:
- Learn ABAP by rebuilding its runtime behavior
- Decouple ABAP logic from SAP systems
- Enable modern web applications using ABAP syntax
- Provide a REST-based execution model suitable for UI frameworks

This project is not a SAP replacement.
It is a clean, minimal ABAP runtime implementation for learning and experimentation.

---

## Architecture

ABAP source code is sent to the server via HTTP.
The runtime executes the program and returns structured output as JSON.

Execution flow:

ABAP Source  
→ Runtime Interpreter  
→ Output Buffer  
→ JSON Response  
→ Web UI

---

## Features

- ABAP-style REPORT programs
- Executable WRITE statements
- Runtime execution (not only parsing)
- JSON output suitable for UI consumption
- REST API interface
- Extensible design for services and UI layers

---

## Example ABAP Program

```abap
REPORT z_demo.
WRITE 'ABAP TEXT MODE WORKS'.
WRITE 'PARSER CONNECTED SUCCESSFULLY'.

