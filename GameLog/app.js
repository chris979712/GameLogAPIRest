import { CrearServidor } from "./src/server.js";

import { ModeloAcceso } from "./src/api_rest/model/sql/Acceso.js";

CrearServidor({ModeloAcceso : ModeloAcceso});