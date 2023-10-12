import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('keyword_channel_explores', (table) => {
        table.tinyint('status').defaultTo(1).nullable();
    });

    await knex.schema.alterTable('keyword_labellings', (table) => {
        table.tinyint('status').defaultTo(1).nullable();
    });

    await knex.schema.alterTable('keyword_search_trackers', (table) => {
        table.tinyint('status').defaultTo(1).nullable();
    });

    return knex.schema.alterTable('extract_data', (table) => {
        table.tinyint('status').defaultTo(1).nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Implement the down migration if needed
}
