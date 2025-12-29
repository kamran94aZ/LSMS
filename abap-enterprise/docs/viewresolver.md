# DDIC View Resolver – Simple Explanation

This file resolves tables and views.

It decides whether a name refers to a table
or to a view, and prepares it for execution.

---

## Big Idea

Not every data source is simple.

Sometimes a name points directly to a table.

Sometimes it represents a view
that combines multiple tables.

This file understands the difference.

---

## What This File Does

This file:

- checks if a name is a table
- checks if a name is a view
- expands views into their structure
- returns a clear execution model

It translates definitions into usable form.

---

## Table Resolution

When a table name is provided:

- it is identified as a table
- no further expansion is needed
- the table can be used directly

This is the simplest case.

---

## View Resolution

When a view name is provided:

- the view definition is loaded
- the base table is identified
- joins are listed
- visible fields are resolved

The view is converted into a clear structure.

---

## View Expansion

Expanding a view means:

- showing its base table
- listing its joins
- listing its fields

Nothing is hidden.

The structure becomes explicit.

---

## Error Handling

If a name is neither a table nor a view:

- an error is raised
- execution is stopped

This prevents invalid access.

---

## Role in the System

This file:

- bridges definitions and execution
- enables query processing
- supports reporting and data access

It does not store data.

It explains how data should be accessed.

---

## Comparison With SAP

SAP systems resolve views at runtime.

They:

- distinguish tables from views
- expand view definitions
- prepare execution structures

This file follows the same idea
in a lightweight and portable form.

---

## Summary

This file:

- resolves tables and views
- expands view definitions
- prepares execution structures

It is a translation component.

---


