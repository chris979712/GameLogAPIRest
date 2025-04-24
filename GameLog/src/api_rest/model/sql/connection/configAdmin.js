import dotenv from 'dotenv';
dotenv.config();

export const connection = {
    user: process.env.DB_USERADMIN,
    password: process.env.DB_PASSWORDADMIN,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
    }
}