import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaLogin } from './api_rest/routes/Login.js';
import { CrearRutaJugador } from './api_rest/routes/Jugador.js';
import { CrearRutaJuego } from './api_rest/routes/Juego.js';
import { CrearRutaSeguidor } from './api_rest/routes/Seguidor.js';
import { CrearRutaReseña } from './api_rest/routes/Reseña.js';
import { DocumentoSwagger } from './api_rest/utilidades/swagger.js';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';


export const CrearServidor = ({ModeloAcceso, ModeloLogin,ModeloJugador,ModeloJuego,ModeloSeguidor,ModeloReseña}) => 
{
    const app = express();
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

    app.use('/gamelog/login',CrearRutaLogin({ModeloLogin}));
    app.use('/gamelog/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/gamelog/jugador',CrearRutaJugador({ModeloJugador}));
    app.use('/gamelog/juego',CrearRutaJuego({ModeloJuego}));
    app.use('/gamelog/seguidor',CrearRutaSeguidor({ModeloSeguidor}));
    app.use('/gamelog/resena',CrearRutaReseña({ModeloReseña}))
    app.use('/gamelog/doc',swaggerUI.serve, swaggerUI.setup(DocumentoSwagger));

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    })
}