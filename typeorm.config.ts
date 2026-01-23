import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// export default new DataSource({
//     type: 'postgres',
//     host: '127.0.0.1',
//     port: 5432,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,

//     entities: ['src/users/user.entity.ts'],
//     migrations: ['src/migrations/*.ts'],

//     logging: true,
// });

export default new DataSource({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
});
