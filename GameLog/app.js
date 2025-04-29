import { CrearServidor } from "./src/server.js";

import { ModeloAcceso } from "./src/api_rest/model/sql/Acceso.js";
import {ModeloLogin} from "./src/api_rest/model/sql/Login.js";

CrearServidor({ModeloAcceso : ModeloAcceso, ModeloLogin: ModeloLogin});