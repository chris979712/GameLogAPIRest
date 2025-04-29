import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { CrearRutaLogin } from './api_rest/routes/Login.js';
import { ValidarJwt } from './api_rest/middlewares/jwt.js';

export const CrearServidor = ({ModeloAcceso, ModeloLogin}) => 
{
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.get('/',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de GameLogAPI'});
    })

    app.use('/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/login',CrearRutaLogin({ModeloLogin}));

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    })
}

export const CrearServidorTest = ({ModeloAcceso, ModeloLogin}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');
    app.get('/',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de GameLogAPI'});
    });
    app.use('/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/login',CrearRutaLogin({ModeloLogin}));

    const PUERTO = process.env.PUERTO;
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}