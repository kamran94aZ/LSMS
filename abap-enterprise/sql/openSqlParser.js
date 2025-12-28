"use strict";

/**
 * Open SQL Parser (Logical SQL Builder)
 * ------------------------------------
 * Converts SELECT AST into a logical SQL representation
 *
 * SAP equivalent:
 * - Open SQL Rewriter
 * - SQL Normalizer
 */

class OpenSqlParser {

    parse(selectNode) {
        return {
            type: "SELECT",
            table: selectNode.table,
            fields: selectNode.fields,
            where: selectNode.where,
            into: selectNode.into,
            intoTable: selectNode.intoTable,
            joins: selectNode.joins || [],
            groupBy: selectNode.groupBy || null,
            orderBy: selectNode.orderBy || null
        };
    }
}

module.exports = OpenSqlParser;
