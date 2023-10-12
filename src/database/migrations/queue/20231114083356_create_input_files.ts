import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('input_files', (table) => {
    table.bigIncrements('id').primary();
    table.text('name');
    table.text('url');
    table.text('tab');
    table.text('status');
    table.text('query');
    table.integer('size');
    table.smallint('progress').defaultTo(0);
    table.bigInteger('index_processed').defaultTo(0);
    table.integer('row_count');
    table.text('result_url');
    table.timestamp('start_time', { useTz: true });
    table.timestamp('end_time', { useTz: true });
    table.boolean('is_visible').defaultTo(true);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('input_files');
}
