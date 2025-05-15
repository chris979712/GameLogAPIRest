import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/AccesoRuta.js';
import { CrearRutaLogin } from './api_rest/routes/LoginRuta.js';
import { CrearRutaJugador } from './api_rest/routes/JugadorRuta.js';
import { CrearRutaJuego } from './api_rest/routes/JuegoRuta.js';
import { CrearRutaSeguidor } from './api_rest/routes/SeguidorRuta.js';
import { CrearRutaReseña } from './api_rest/routes/ReseñaRuta.js';
import { CrearRutaLike } from './api_rest/routes/LikeRuta.js';
import { CrearRutaReportesEstadisticos } from './api_rest/routes/ReportesRuta.js';
import cors from 'cors';
import dotenv from 'dotenv';

export const CrearServidorTest = ({ModeloAcceso, ModeloLogin, ModeloJugador,ModeloJuego,ModeloSeguidor,ModeloReseña,ModeloLike,ModeloReportesEstadisticos}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.get('/',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de pruebas de GameLogAPI'});
    });
    app.use('/gamelog/login',CrearRutaLogin({ModeloLogin,ModeloAcceso}));
    app.use('/gamelog/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/gamelog/jugador',CrearRutaJugador({ModeloJugador}))
    app.use('/gamelog/juego',CrearRutaJuego({ModeloJuego}))
    app.use('/gamelog/seguidor',CrearRutaSeguidor({ModeloSeguidor}))
    app.use('/gamelog/like',CrearRutaLike({ModeloLike}));
    app.use('/gamelog/reporte',CrearRutaReportesEstadisticos({ModeloReportesEstadisticos}));
    app.use('/gamelog/resena',CrearRutaReseña({ModeloReseña}))

    const PUERTO = process.env.PUERTO_PRUEBAS;
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}