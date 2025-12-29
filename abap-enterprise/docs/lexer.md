# Lexer Rules – Simple Explanation

This file defines the basic language rules.

It tells the system
which words and symbols are special
and how they should be recognized.

---

## Big Idea

Before a system can understand a program,
it must recognize its words and symbols.

This file provides that recognition.

It acts like an alphabet
for the language.

---

## What This File Does

This file:

- lists all reserved words
- lists all special symbols
- groups them by category
- exposes them for easy reading

It does not execute logic.

It defines language building blocks.

---

## Keyword Rules

Keywords are special words.

They are not normal text.

They tell the system
what kind of action is intended.

Examples include:

- program start words
- control flow words
- data definition words
- object-oriented words

When the system sees these words,
it treats them as commands.

---

## Operator Rules

Operators are special symbols.

They describe:

- comparisons
- assignments
- calculations
- grouping
- separation

Operators are recognized separately
from normal characters.

---

## Rule Organization

Rules are organized into groups.

Each group has:

- a clear type name
- a list of values

This makes rule processing simple
and predictable.

---

## Iteration Support

The rule list can be read step by step.

This allows other parts of the system
to scan and use the rules
without knowing internal details.

---

## Role in the System

This file:

- supports the lexer
- enables token recognition
- forms the foundation of parsing

It is the first step
in understanding a program.

---

## Comparison With SAP

SAP systems recognize ABAP keywords
using internal language rules.

They:

- define reserved words
- define operators
- process them during parsing

This file follows the same idea
in a lightweight and portable form.

---

## Summary

This file:

- defines language words
- defines language symbols
- supports program analysis

It is a foundational language component.

---

