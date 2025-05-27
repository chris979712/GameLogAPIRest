import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/AccesoRuta.js';
import { CrearRutaLogin } from './api_rest/routes/LoginRuta.js';
import { CrearRutaJugador } from './api_rest/routes/JugadorRuta.js';
import { CrearRutaJuego } from './api_rest/routes/JuegoRuta.js';
import { CrearRutaSeguidor } from './api_rest/routes/SeguidorRuta.js';
import { CrearRutaReseña } from './api_rest/routes/ReseñaRuta.js';
import { CrearRutaLike } from './api_rest/routes/LikeRuta.js';
import { CrearRutaReportesEstadisticos } from './api_rest/routes/ReportesRuta.js';
import { CrearRutaNotificacion } from './api_rest/routes/NotificacionRuta.js';
import { DocumentoSwagger } from './api_rest/utilidades/swagger.js';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';


export const CrearServidor = ({ModeloAcceso, ModeloLogin,ModeloJugador,ModeloJuego,ModeloSeguidor,ModeloReseña,ModeloLike,ModeloReportesEstadisticos,ModeloNotificacion}) => 
{
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    /**
     * @swagger
     * tags:
     *  name: Welcome
     *  description: Ruta de bienvenida a la API
     */
    app.get('/gamelog',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de GameLogAPI'});
    })

    app.use('/gamelog/login',CrearRutaLogin({ModeloLogin,ModeloAcceso}));
    app.use('/gamelog/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/gamelog/jugador',CrearRutaJugador({ModeloJugador}));
    app.use('/gamelog/juego',CrearRutaJuego({ModeloJuego}));
    app.use('/gamelog/seguidor',CrearRutaSeguidor({ModeloSeguidor}));
    app.use('/gamelog/resena',CrearRutaReseña({ModeloReseña}));
    app.use('/gamelog/like',CrearRutaLike({ModeloLike}));
    app.use('/gamelog/reporte',CrearRutaReportesEstadisticos({ModeloReportesEstadisticos}));
    app.use('/gamelog/notificacion',CrearRutaNotificacion({ModeloNotificacion}));
    app.use('/gamelog/doc',swaggerUI.serve, swaggerUI.setup(DocumentoSwagger));

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    })
}