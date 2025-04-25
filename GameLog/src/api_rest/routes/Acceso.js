import { Router } from 'express';
import { AccesoControlador } from "../controllers/Acceso.js";

export const CrearRutaAcceso = ({ModeloAcceso}) =>
{

    const AccesoEnrutador = Router();
    const ControladorAccesoEnrutador = new AccesoControlador({ModeloAcceso});
    AccesoEnrutador.post('/',ControladorAccesoEnrutador.RegistrarAcceso);
    AccesoEnrutador.patch('/:id');
    AccesoEnrutador.patch('/:id/estado');

    return AccesoEnrutador;
}