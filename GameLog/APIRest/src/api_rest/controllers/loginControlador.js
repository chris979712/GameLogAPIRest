import { ValidarDatosLoginIngresados,ValidarRecuperacionCuenta,ValidarDatosLoginParcialIngresados } from "../schemas/LoginValidador.js";
import { logger } from "../utilidades/logger.js";
import { GenerarJWT } from "../utilidades/generadorjwt.js";
import { EnviarCorreoDeVerificacion } from "../utilidades/Correo.js";
import path from 'path';
import { ObtenerDirectorioActual } from "../utilidades/Directorio.js";
import { UsuariosActivos } from "../utilidades/Constantes.js";

export class LoginControlador
{
    constructor({ModeloLogin,ModeloAcceso})
    {
        this.modeloLogin = ModeloLogin;
        this.modeloAcceso = ModeloAcceso;
        this.CodigosDeVerificacion = { };
    }

    Login = async(req, res) =>
    {
        try
        {
            const {correo,contrasenia,tipoDeUsuario} = req.body;
            const Datos = {correo, contrasenia, tipoDeUsuario};
            const ResultadoValidacion = ValidarDatosLoginIngresados(Datos);
            if(ResultadoValidacion.success)
            {
                if (UsuariosActivos[correo]) 
                {
                    res.status(401).json({
                        error: true,
                        estado: 401,
                        mensaje: 'El usuario ya tiene una sesión activa, cierre sesión desde el otro dispositivo para iniciar sesión aquí.'
                    })
                }
                else
                {
                    const ResultadoConsulta = await this.modeloLogin.Login({datos: ResultadoValidacion.data, tipoDeUsuario: ResultadoValidacion.data.tipoDeUsuario});
                    let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                    if(resultadoConsulta === 200)
                    {
                        if(ResultadoConsulta.cuenta[0].estado==="Baneado")
                        {
                            res.status(401).json({
                                error: false,
                                estado: 401,
                                mensaje: "Usuario baneado, su cuenta se encuentra baneada, no es posible acceder a la aplicación."
                            })
                        }
                        else{
                            const TipoDeAccesoObtenido = ResultadoConsulta.cuenta[0].tipoDeAcceso;
                            const DatosUsuario = {correo,TipoDeAccesoObtenido};
                            const token = await GenerarJWT(DatosUsuario);
                            UsuariosActivos[correo] = { tipoDeUsuario, token };
                            res.header('access_token',token);
                            res.status(200).json({
                                error: false,
                                estado: resultadoConsulta,
                                cuenta: ResultadoConsulta.cuenta
                            })
                        }
                        
                    }
                    else
                    {
                        res.status(resultadoConsulta).json({
                            error: true,
                            estado: resultadoConsulta,
                            mensaje: ResultadoConsulta.mensaje
                        })
                    }
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
                mensaje: 'Ha ocurrido un error al obtener los datos del usuario.'
            }
            )
        }
    }

    LogOut = (req, res) =>
    {
        try
        {
            const correo = req.params.correo;
            const Datos = {correo};
            const ResultadoValidacion = ValidarDatosLoginParcialIngresados(Datos);
            if(ResultadoValidacion.success)
            {
                if (UsuariosActivos[correo]) {
                    delete UsuariosActivos[correo];
                    res.status(200).json({
                        error: false,
                        estado: 200,
                        mensaje: "Sesión de usuario cerrada"
                    });
                } else {
                    res.status(404).json({
                        error: true,
                        estado: 404,
                        mensaje: "El usuario no tenía una sesión activa la cual pueda cerrarse"
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error});
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al querer cerrar la sesión del usuario'
            })
        }
    }

    SolicitudRecuperacionDeContraseña = async(req, res) =>
    {
        try
        {
            const {correo,tipoDeUsuario} = req.body;
            const Datos = {correo, tipoDeUsuario};
            const ResultadoValidacion = ValidarRecuperacionCuenta(Datos);
            if(ResultadoValidacion.success)
            {
                const __dirname = ObtenerDirectorioActual(import.meta.url);
                const ResultadoConsulta = await this.modeloAcceso.ObtenerIdDeAccesoPorCorreo({datos: ResultadoValidacion.data, tipoDeUsuario:tipoDeUsuario})
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                if(resultadoConsulta===200)
                {
                    const Codigo = Math.floor(100000 + Math.random() * 900000);
                    this.CodigosDeVerificacion[correo] = {
                        codigo: Codigo,
                        expiracion: Date.now() + 30 * 60 * 1000
                    };
                    const PlantillaHTML = path.join(__dirname, '../utilidades/plantillacodigoverificacion.html');
                    await EnviarCorreoDeVerificacion(PlantillaHTML,correo,Codigo);
                    res.status(200).json({
                        error: false,
                        estado: 200,
                        mensaje: 'El correo con el código de verificación ha sido enviado de manera exitosa',
                        idAcceso: ResultadoConsulta.idAcceso,
                        codigo: Codigo //El código se puso en la respuesta para fines de pruebas, en producción o despliegue, será eliminadod  el código
                    })
                    
                }
                else
                {
                    res.status(resultadoConsulta).json({
                        error: true,
                        estado: resultadoConsulta,
                        mensaje: 'El correo ingresado no se encuentra registrado dentro del sistema.'
                    })
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
                mensaje: 'Ha ocurrido un error al obtener un código de verificación.'
            }
            )
        }
    }

    ValidarCodigoDeVerificacion = async(req, res) =>
    {
        try
        {
            const {correo,codigo,tipoDeUsuario} = req.body;
            const Datos = {correo,codigo,tipoDeUsuario};
            const ResultadoValidacion = ValidarRecuperacionCuenta(Datos);
            if(ResultadoValidacion.success)
            {
                const SolicitudValidacion = this.CodigosDeVerificacion[correo];
                if(SolicitudValidacion)
                {
                    if(SolicitudValidacion.expiracion < Date.now())
                    {
                        delete this.CodigosDeVerificacion[correo];
                        res.status(400).json({
                            error: true,
                            estado: 400,
                            mensaje: 'El código ingresado ha expirado.'
                        })
                    }
                    else
                    {
                        if(SolicitudValidacion.codigo === parseInt(codigo))
                        {
                            res.status(200).json({
                                error: false,
                                estado: 200,
                                mensaje: 'Código de verificación válido'
                            })
                            delete this.CodigosDeVerificacion[correo];
                        }
                        else
                        {
                            res.status(404).json({
                                error: true,
                                estado: 404,
                                mensaje: 'El código ingresado no es correcto.'
                            });                            
                        }
                    }
                }
                else
                {
                    res.status(400).json({
                        error: true,
                        estado: 404,
                        mensaje: 'No se ha solicitado ningún código de verificación para el correo ingresado.'
                    })
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
                mensaje: 'Ha ocurrido un error al verificar un código de verificación.'
            })
        }
    }
}