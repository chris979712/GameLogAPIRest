import { CrearServidor } from "./src/server.js";
import { ModeloAcceso } from "./src/api_rest/model/sql/Acceso.js";
import {ModeloLogin} from "./src/api_rest/model/sql/Login.js";
import {ModeloJugador} from "./src/api_rest/model/sql/Jugador.js";
import {ModeloJuego} from './src/api_rest/model/sql/Juego.js';
import {ModeloReseña} from "./src/api_rest/model/sql/Reseña.js";
import {ModeloSeguidor} from "./src/api_rest/model/sql/Seguidor.js";
import { ModeloLike } from "./src/api_rest/model/sql/Like.js";

CrearServidor({ModeloAcceso : ModeloAcceso, 
    ModeloLogin: ModeloLogin, 
    ModeloJugador: ModeloJugador,
    ModeloJuego:ModeloJuego,
    ModeloReseña:ModeloReseña,
    ModeloSeguidor:ModeloSeguidor,
    ModeloLike:ModeloLike});