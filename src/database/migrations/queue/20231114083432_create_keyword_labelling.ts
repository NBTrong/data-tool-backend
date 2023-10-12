import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('keyword_labellings', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('input_file_id').notNullable().unsigned();
    table.string('keyword', 512);
    table.text('labels');
    table.integer('confident_rate');
    table.text('similar_keywords');

    table.foreign('input_file_id')
      .references('id')
      .inTable('input_files')
      .onDelete('CASCADE');
  }).then(() => knex.raw('ALTER TABLE keyword_labellings OWNER TO xdata_user'));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('keyword_labellings');
}
