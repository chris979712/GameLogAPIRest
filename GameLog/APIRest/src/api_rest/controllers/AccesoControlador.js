import { ValidarEdicionParcialAcceso, ValidarEliminacionAcceso, ValidarInsercionAcceso, ValidarCredencialesAcceso } from "../schemas/AccesoValidador.js";
import { logger } from "../utilidades/logger.js";

export class AccesoControlador
{
    constructor({ModeloAcceso})
    {
        this.modeloAcceso = ModeloAcceso;
    }

    RegistrarAcceso = async (req, res) =>
    {
        try
        {
            const ResultadoValidacion = ValidarInsercionAcceso(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloAcceso.InsertarNuevaCuenta({datos: ResultadoValidacion.data, tipoDeUsuario: ResultadoValidacion.data.tipoDeUsuario})
                let resultadoInsercion = parseInt(ResultadoInsercion.resultado)
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                        {
                            error: true,
                            estado: ResultadoInsercion.resultado,
                            mensaje: 'Ha ocurrido un error en la base de datos al querer insertar los datos una nueva cuenta de acceso'
                        });
                }
                else
                {
                    res.status(resultadoInsercion).json(
                        {
                            error: resultadoInsercion !== 200,
                            estado: ResultadoInsercion.resultado,
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer registrar el Acceso."
            });
        }
    }

    ObtenerIDDeCuentaDeAcceso = async (req,res) =>
    {
        try
        {
            const correo = req.params.correo;
            const {tipoDeUsuario} = req;
            const Datos = {correo};
            const ResultadoValidacion = ValidarCredencialesAcceso(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloAcceso.ObtenerIdDeAccesoPorCorreo({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? { idAcceso: ResultadoConsulta.idAcceso }
                        : { mensaje: ResultadoConsulta.mensaje }
                    )
                });
                
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al obtener los datos del usuario.'
            }
            )
        }

    }

    EditarAcceso = async (req, res) =>
    {
        try
        {
            const idAcceso = parseInt(req.params.idAcceso);
            const {correo,contrasenia} = req.body;
            const {tipoDeUsuario} = req;
            const Datos = {idAcceso, correo, contrasenia, tipoDeUsuario};
            const ResultadoValidacion = ValidarEdicionParcialAcceso(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEdicion = await this.modeloAcceso.EditarAcceso({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario})
                let resultadoEdicion = parseInt(ResultadoEdicion.estado)
                if(resultadoEdicion === 500)
                {
                    logger({mensaje: ResultadoEdicion.mensaje});
                    res.status(resultadoEdicion).json(
                        {
                            error: true,
                            estado: ResultadoEdicion.resultado,
                            mensaje: 'Ha ocurrido un error en la base de datos al querer editar los datos una cuenta de acceso'
                        });
                }
                else
                {
                    res.status(resultadoEdicion).json(
                        {
                            error: resultadoEdicion !== 200,
                            estado: ResultadoEdicion.resultado,
                            mensaje: ResultadoEdicion.mensaje
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al editar el acceso del usuario.'
            }
            )
        }
    }

    EditarEstadoAcceso = async (req, res) =>
    {
        try
        {
            const idAcceso= parseInt(req.params.idAcceso);
            const {estadoAcceso} = req.body;
            const {tipoDeUsuario} = req;
            const Datos = {idAcceso, tipoDeUsuario, estadoAcceso};
            const ResultadoValidacion = ValidarEdicionParcialAcceso(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEdicion = await this.modeloAcceso.EditarEstadoAcceso({datos: ResultadoValidacion.data, tipoDeUsuario: ResultadoValidacion.data.tipoDeUsuario});
                let resultadoEdicion = parseInt(ResultadoEdicion.estado)
                if(resultadoEdicion === 500)
                {
                    logger({mensaje: ResultadoEdicion.mensaje});
                    console.log(resultadoEdicion);
                    res.status(resultadoEdicion).json(
                        {
                            error: true,
                            estado: ResultadoEdicion.resultado,
                            mensaje: 'Ha ocurrido un error en la base de datos al querer editar los datos una cuenta de acceso'
                        });
                }
                else
                {
                    res.status(resultadoEdicion).json(
                        {
                            error: resultadoEdicion !== 200,
                            estado: ResultadoEdicion.resultado,
                            mensaje: ResultadoEdicion.mensaje
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al editar el estado de acceso'
            }
            )
        }
    }

    BorrarAcceso = async (req, res) =>
    {
        try
        {
            const idAcceso = parseInt(req.params.idAcceso);
            const {correo} = req.body;
            const datos = { idAcceso, correo };
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarEliminacionAcceso(datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloAcceso.BorrarAcceso({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado)
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                        {
                            error: true,
                            estado: ResultadoEliminacion.resultado,
                            mensaje: 'Ha ocurrido un error en la base de datos al querer eliminar una cuenta de acceso'
                        });
                }
                else
                {
                    res.status(resultadoEliminacion).json(
                        {
                            error: resultadoEliminacion !== 200,
                            estado: ResultadoEliminacion.resultado,
                            mensaje: ResultadoEliminacion.mensaje
                        });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje:"Campos inválidos, por favor verifique que sean correctos."
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al eliminar al usuario.'
            }
            )
        }
    }
}