import { logger } from "../utilidades/logger.js";
import { ValidarLike } from "../schemas/Like.js";

export class LikeControlador
{
    constructor({ModeloLike})
    {
        this.modeloLike = ModeloLike;
    }

    RegistrarLikeAReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarLike(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloLike.RegistrarLikeAReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer darle like a una reseña'
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
                    mensaje: ResultadoValidacion.error.formErrors
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
                    mensaje: "Ha ocurrido un error al querer registar el like a la reseña"
                }
            )
        }
    }

    EliminarLikeDeReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const idResena = parseInt(req.params.idResena);
            const Datos = {idJugador,idResena};
            const ResultadoValidacion = ValidarLike(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloLike.EliminarLikeDeReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: resultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer eliminar el like de una reseña'
                    });
                }
                else
                {
                    res.status(resultadoEliminacion).json({
                        error: resultadoEliminacion !== 200,
                        estado: resultadoEliminacion,
                        mensaje: resultadoEliminacion.mensaje
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
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
                    mensaje: "Ha ocurrido un error al querer eliminar el like a la reseña"
                }
            )
        }
    }
}