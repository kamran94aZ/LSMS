# DDIC Loader – Simple Explanation

This file loads and manages system data definitions.

It provides a shared dictionary
that defines how data is structured and understood.

---

## Big Idea

Every system needs rules for its data.

These rules describe:

- what data exists
- how data is shaped
- how data should be interpreted

This file loads those rules and keeps them ready.

---

## What This File Does

This file:

- reads data definitions from files
- loads them into memory
- organizes them by category
- provides fast access to them

It prepares the data dictionary for the system.

---

## Data Dictionary Objects

The dictionary includes:

- tables
- views
- domains
- elements

Each type is stored separately
to keep definitions clear and structured.

---

## Loading Process

When loading starts:

- predefined folders are checked
- definition files are read
- data is parsed and stored
- names are normalized

Only valid definition files are loaded.

---

## Central Access

Once loaded:

- definitions are kept in memory
- lookups are fast
- rules are shared across the system

All parts of the system use the same definitions.

---

## Lookup Functions

The system can:

- retrieve a table definition
- retrieve a view definition
- retrieve a domain definition
- retrieve an element definition

If a definition does not exist,
nothing is returned.

---

## Role in the System

This file:

- defines system data structure
- supports validation and consistency
- acts as a central reference

It does not store business data.

It stores data rules.

---

## Comparison With SAP

SAP systems use the Data Dictionary (DDIC).

They:

- define tables and views
- control data types
- cache dictionary definitions

This file follows the same idea
in a lightweight and portable form.

---

## Summary

This file:

- loads data definitions
- organizes dictionary objects
- provides shared access to data rules

It is a foundational system component.

---


