import { Router } from "express";
import { JuegoControlador } from "../controllers/Juego.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaJuego = ({ModeloJuego}) =>
{
    const JuegoEnrutador = Router();
    const ControladorJuegoEnrutador = new JuegoControlador({ModeloJuego});

    JuegoEnrutador.post('/',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuego);
    JuegoEnrutador.post('/favorito',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuegoFavorito);
    JuegoEnrutador.post('/pendiente',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuegoPendiente);
    JuegoEnrutador.get('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorID);
    JuegoEnrutador.get('/',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorNombre);
    JuegoEnrutador.get('/favorito/:idJugador',ValidarJwt,ControladorJuegoEnrutador.ObtenerJuegosFavoritos);
    JuegoEnrutador.get('/pendiente/:idJugador',ValidarJwt,ControladorJuegoEnrutador.ObtenerJuegosPendientes);
    JuegoEnrutador.delete('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.EliminarJuego);
    JuegoEnrutador.delete('/favorito/:idJuego/:idJugador',ValidarJwt,ControladorJuegoEnrutador.EliminarJuegoFavorito);
    JuegoEnrutador.delete('/pendiente/:idJuego/:idJugador',ValidarJwt,ControladorJuegoEnrutador.EliminarJuegoPendiente);
    
    return JuegoEnrutador;
}