import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import cors from 'cors';
import dotenv from 'dotenv';

export const CrearServidor = ({ModeloAcceso}) => 
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

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    })
}