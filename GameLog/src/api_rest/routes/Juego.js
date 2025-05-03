import { Router } from "express";
import { JuegoControlador } from "../controllers/Juego.js";
import { ValidarJwt } from "../middlewares/jwt";

export const CrearRutaJuego = ({ModeloJuego}) =>
{
    const JuegoEnrutador = Router();
    const ControladorJuegoEnrutador = new JuegoControlador({ModeloJuego});

    JuegoEnrutador.post('/',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuego);
    JuegoEnrutador.get('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorID);
    JuegoEnrutador.get('/',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorNombre);
    JuegoEnrutador.delete('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.EliminarJuego);
    
    return JuegoEnrutador;
}