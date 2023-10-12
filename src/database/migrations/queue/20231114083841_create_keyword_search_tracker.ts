import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('keyword_search_trackers', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('input_file_id').notNullable().unsigned();
    table.string('keyword', 512);
    table.bigInteger('search_volume');
    table.bigInteger('bid_price');
    table.bigInteger('min_price');
    table.bigInteger('max_price');
    table.text('trend');

    table.foreign('input_file_id')
      .references('id')
      .inTable('input_files')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('keyword_search_trackers');
}
