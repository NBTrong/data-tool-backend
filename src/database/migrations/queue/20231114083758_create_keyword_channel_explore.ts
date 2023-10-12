import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('keyword_channel_explores', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('input_file_id').notNullable().unsigned();
    table.text('keyword');
    table.text('post_url');
    table.text('koc');
    table.string('platform', 128);
    table.text('description');
    table.text('thumb_url');
    table.text('tags');
    table.bigInteger('total_views');
    table.bigInteger('total_likes');
    table.bigInteger('total_shares');
    table.bigInteger('total_comments');
    table.bigInteger('total_saves');
    table.bigInteger('koc_follower_count');
    table.string('uploaded_time', 128);

    table.foreign('input_file_id')
      .references('id')
      .inTable('input_files')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('keyword_channel_explores');
}
