import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('input_files', (table) => {
        table.bigInteger('total_success');
    });
}


export async function down(knex: Knex): Promise<void> {
}

