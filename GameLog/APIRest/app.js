import { CrearServidor } from "./src/server.js";
import { ModeloAcceso } from "./src/api_rest/model/sql/AccesoModelo.js";
import {ModeloLogin} from "./src/api_rest/model/sql/LoginModelo.js";
import {ModeloJugador} from "./src/api_rest/model/sql/JugadorModelo.js";
import {ModeloJuego} from './src/api_rest/model/sql/JuegoModelo.js';
import {ModeloReseña} from "./src/api_rest/model/sql/ReseñaModelo.js";
import {ModeloSeguidor} from "./src/api_rest/model/sql/SeguidorModelo.js";
import { ModeloLike } from "./src/api_rest/model/sql/LikeModelo.js";
import { ModeloReportesEstadisticos } from "./src/api_rest/model/sql/ReportesModelo.js";
import { ModeloNotificacion } from "./src/api_rest/model/sql/NotificacionModelo.js";

CrearServidor({ModeloAcceso : ModeloAcceso, 
    ModeloLogin: ModeloLogin, 
    ModeloJugador: ModeloJugador,
    ModeloJuego:ModeloJuego,
    ModeloReseña:ModeloReseña,
    ModeloSeguidor:ModeloSeguidor,
    ModeloLike:ModeloLike,
    ModeloReportesEstadisticos:ModeloReportesEstadisticos,
    ModeloNotificacion:ModeloNotificacion
});