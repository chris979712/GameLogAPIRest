import { Router } from "express";
import { SeguidorControlador } from "../controllers/Seguidor.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaSeguidor = ({ModeloSeguidor}) =>
{
    const SeguidorEnrutador = Router();
    const ControladorSeguidorEnrutador = new SeguidorControlador({ModeloSeguidor});
    SeguidorEnrutador.post('/',ValidarJwt,ControladorSeguidorEnrutador.RegistrarJugadorASeguir);
    SeguidorEnrutador.get('/seguidores/:idJugadorSeguido',ValidarJwt,ControladorSeguidorEnrutador.ConsultarSeguidores);
    SeguidorEnrutador.get('/seguidos/:idJugadorSeguidor',ValidarJwt,ControladorSeguidorEnrutador.ConsultarSeguidos);
    SeguidorEnrutador.delete('/:idJugadorSeguidor/:idJugadorSeguido',ValidarJwt,ControladorSeguidorEnrutador.EliminarSeguido);
    return SeguidorEnrutador;
}