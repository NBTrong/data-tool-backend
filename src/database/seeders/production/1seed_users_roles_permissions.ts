import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del(); // Inserts seed entries

  // Insert admin users and get the ids
  await knex('users').insert([
    {
      username: 'BD-Admin',
      email: 'colorme.job@gmail.com',
      password: '$2b$10$8WscL.rgGMXYUapqR3wDze02ntw3z2HyWK7B/VduEpCdoxEgDKkYm',
      phone: '0123456789',
      address: 'Hanoi, Vietnam',
      bio: 'I am the admin of this website',
      color: '#000000',
      avatar_url: 'https://i.pravatar.cc/300',
      archived: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: 'Admin',
      email: 'admin@gmail.com',
      password: '$2b$10$8WscL.rgGMXYUapqR3wDze02ntw3z2HyWK7B/VduEpCdoxEgDKkYm',
      phone: '0123456789',
      address: 'Hanoi, Vietnam',
      bio: 'I am the admin of this website',
      color: '#000000',
      avatar_url: 'https://i.pravatar.cc/300',
      archived: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ])
    .returning('id');
}
