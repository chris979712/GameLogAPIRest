import { logger } from "../utilidades/logger.js";
import { ValidarMeGusta } from "../schemas/MeGustaValidador.js";

export class MeGustaControlador
{
    constructor({ModeloMeGusta})
    {
        this.modeloMeGusta = ModeloMeGusta;
    }

    RegistrarMeGustaAReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarMeGusta(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloMeGusta.RegistrarMeGustaAReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer darle me gusta a una reseña'
                    });
                }
                else
                {
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 200,
                        estado: resultadoInsercion,
                        mensaje: ResultadoInsercion.mensaje
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "Campos inválidos, por favor verifique que sean correctos."
                });    
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer registar el me gusta a la reseña"
                }
            )
        }
    }

    EliminarMeGustaDeReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const idResena = parseInt(req.params.idResena);
            const Datos = {idJugador,idResena};
            const ResultadoValidacion = ValidarMeGusta(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloMeGusta.EliminarMeGustaDeReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: resultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer eliminar el me gusta de una reseña'
                    });
                }
                else
                {
                    res.status(resultadoEliminacion).json({
                        error: resultadoEliminacion !== 200,
                        estado: resultadoEliminacion,
                        mensaje: ResultadoEliminacion.mensaje
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "Campos inválidos, por favor verifique que sean correctos."
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer eliminar el me gusta a la reseña"
                }
            )
        }
    }
}