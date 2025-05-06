import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaLogin } from './api_rest/routes/Login.js';
import { CrearRutaJugador } from './api_rest/routes/Jugador.js';
import { CrearRutaJuego } from './api_rest/routes/Juego.js';
import { CrearRutaSeguidor } from './api_rest/routes/Seguidor.js';
import cors from 'cors';
import dotenv from 'dotenv';

export const CrearServidorTest = ({ModeloAcceso, ModeloLogin, ModeloJugador,ModeloJuego,ModeloSeguidor}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.get('/',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de pruebas de GameLogAPI'});
    });
    app.use('/gamelog/login',CrearRutaLogin({ModeloLogin}));
    app.use('/gamelog/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/gamelog/jugador',CrearRutaJugador({ModeloJugador}))
    app.use('/gamelog/juego',CrearRutaJuego({ModeloJuego}))
    app.use('/gamelog/seguidor',CrearRutaSeguidor({ModeloSeguidor}))

    const PUERTO = process.env.PUERTO;
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}