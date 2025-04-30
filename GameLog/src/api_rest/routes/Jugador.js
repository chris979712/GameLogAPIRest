import { Router } from 'express';
import { JugadorControlador } from '../controllers/Jugador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaJugador = ({ModeloJugador}) => 
{
    const JugadorEnrutador = Router();
    const ControladorJugadorEnrutador = new JugadorControlador({ModeloJugador});
    JugadorEnrutador.get('/:nombreDeUsuario',ValidarJwt,ControladorJugadorEnrutador.BuscarJugador);
    JugadorEnrutador.put('/:idJugador',ValidarJwt,ControladorJugadorEnrutador.ActualizarJugador);
    JugadorEnrutador.delete('/:idJugador',ValidarJwt,ControladorJugadorEnrutador.EliminarJugador);

    return JugadorEnrutador;
}