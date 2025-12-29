# Discrete Mathematics – Set Foundations (Simple Explanation)

This file explains the math foundation of the system state.
Everything is written as one single system.
Nothing is separated.

Big Idea:
Everything belongs to a group.
A group is called a SET.
A program always lives inside sets.

A set is written like this:
A = { a, b, c }

This means:
a, b, and c belong to A.
Order does not matter.
Duplicates do not matter.

SET A
+----------------+
| a   b   c      |
+----------------+

Each thing is separate.
Each thing is either inside or outside.
There is no middle state.

In math this is written as:
x ∈ A
x ∉ A

Example:

SET A = {1,2,3}

1  ✓ inside
4  ✗ outside

The system works the same way.
It checks if a value belongs to the group.
If it belongs, it is used.
If it does not belong, it is ignored.

Example shape:

if (value exists) {
  use it
}

A set can live inside another set.
This is written as:
B ⊆ A

The inner set is smaller.
The outer set is bigger.

SET A
+----------------------+
|   SET B              |
|   +--------+         |
|   | x   y  |         |
|   +--------+         |
|                      |
+----------------------+

The system is built in layers.
Each layer is a group inside another group.

Example shape:

memory = {
  global: {
    local: {
      value: 10
    }
  }
}

In a set, order does not change meaning.

{1,2,3} = {3,2,1}

Only names matter.
Position does not matter.

Example shape:

state = {
  user: "A",
  time: "now"
}

A set cannot contain the same thing twice.

{a, a, b} = {a, b}

One name represents one value.

Example shape:

env = {
  user: "ADMIN"
}

Sometimes a set is defined by a rule instead of a list.

B = { x | x follows the rule }

RULE:
x must match

match     ✓
no match  ✗

The system keeps only values that follow the rule.

Example shape:

list.filter(item => rule(item))

A set can contain another set as an element.

A = { 1, {2,3}, 4 }

SET A
+---------------------+
| 1                  |
| +-------+          |
| | 2  3  |          |
| +-------+          |
| 4                  |
+---------------------+

This means structures can live inside other structures.

Example shape:

table = [
  { row: { a:1, b:2 } }
]

Math defines the rules.
The system follows the rules.
Code only writes the rules.

It is the program’s system memory.
