import dotenv from 'dotenv';
dotenv.config();

export const connection = {
    user: process.env.DB_USUARIOADMIN,
    password: process.env.DB_CONTRASENIAADMIN,
    server: process.env.DB_SERVIDOR,
    database: process.env.DB_BASEDEDATOS,
    port: parseInt(process.env.DB_PUERTO),
    options: {
        encrypt: process.env.DB_ENCRIPTADO === 'true',
        trustServerCertificate: process.env.DB_CONFIAR_SERVIDOR === 'true'
    }
}