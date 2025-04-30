import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos, ErrorEnLaConfiguracionDeConexionAcceso,ErrorEnLaBaseDeDatosInsercion, ErrorEnLaConfiguracionDeConexion, ErrorEnLaBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloAcceso{

    static async InsertarNuevaCuenta({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const Conexion = await sql.connect(ConfiguracionConexion);
                const {
                    correo,
                    contrasenia,
                    estado,
                    nombre,
                    primerApellido,
                    segundoApellido,
                    nombreDeUsuario,
                    descripcion,
                    foto,
                    tipoDeUsuario
                } = datos;
                const Solicitud = Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.VarChar,contrasenia)
                    .input('estado',sql.VarChar,estado)
                    .input('nombre',sql.VarChar,nombre)
                    .input('primerApellido',sql.VarChar,primerApellido)
                    .input('segundoApellido',sql.VarChar,segundoApellido)
                    .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                    .input('descripcion',sql.VarChar,descripcion)
                    .input('foto',sql.VarChar,foto)
                    .input('tipoDeAcceso',sql.VarChar,tipoDeUsuario)
                    .output('resultado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spi_Acceso');
                resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({datos: ResultadoSolicitud.output})
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoInsercion = ErrorEnLaBaseDeDatosInsercion();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async ObtenerCuentaDeJugadorLogin({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const InstanciaBaseDeDatos = await sql.connect(ConfiguracionConexion);
                const {
                    correo,
                    contrasenia
                } = datos;
                const QueryCuenta = await InstanciaBaseDeDatos.request()
                    .input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.VarChar,contrasenia)
                    .query('SELECT * FROM Accesos a JOIN Jugadores j ON a.idCuenta = j.idAcceso WHERE a.correo = @correo AND a.contrasenia = @contrasenia');
                const ResultadoQueryCuenta = QueryCuenta.recordset;
                if(ResultadoQueryCuenta.length >= 1)
                {
                    resultadoConsulta = {estado: 200, cuenta: ResultadoQueryCuenta};
                }
                else{
                    resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado la cuenta a buscar dentro del sistema'};
                }
            }
            else
            {
                resultadoConsulta = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoConsulta = ErrorEnLaBaseDeDatosAcceso();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async ObtenerIdDeAccesoPorCorreo({datos,tipoDeUsuario}){
        let resultadoConsulta;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try 
        {
            if(ConfiguracionConexion)
                {
                    const InstanciaBaseDeDatos = await sql.connect(ConfiguracionConexion);
                    const {
                        correo,
                    } = datos;
                    const QueryCuenta = await InstanciaBaseDeDatos.request()
                        .input('correo',sql.VarChar,correo)
                        .query('SELECT idCuenta FROM Accesos where correo = @correo');
                    const ResultadoIdCuenta = QueryCuenta.recordset;
                    if(ResultadoIdCuenta.length >= 1)
                    {
                        resultadoConsulta = {estado: 200, idAcceso: ResultadoIdCuenta[0].idCuenta};
                    }
                    else{
                        resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado la cuenta a buscar dentro del sistema'};
                    }
                }
                else
                {
                    resultadoConsulta = { estado: 400, mensaje: "El tipo de usuario a conectar a la base de datos es inválido."};
                }
        }
        catch(error)
        {
            resultadoConsulta = ErrorEnLaBaseDeDatosAcceso();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async EditarAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const Conexion = await sql.connect(ConfiguracionConexion);
                const {
                    idAcceso,
                    correo,
                    contrasenia
                } = datos;
                const Solicitud = Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                    .input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.VarChar,contrasenia)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spa_Acceso');
                resultadoEdicion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoEdicion = ErrorEnLaConfiguracionDeConexion();
            }
        }
        catch(error)
        {
            resultadoEdicion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoEdicion;
    }

    static async EditarEstadoAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const Conexion = await sql.connect(ConfiguracionConexion);
                const
                {
                    idAcceso,
                    estadoAcceso
                } = datos;
                const Solicitud = await Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                    .input('estadoAcceso',sql.VarChar,estadoAcceso)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spa_EstadoAccesos');
                resultadoEdicion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoEdicion = ErrorEnLaConfiguracionDeConexion();
            }
        }
        catch(error)
        {
            resultadoEdicion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoEdicion;
    }

    static async BorrarAcceso({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const Conexion = await sql.connect(ConfiguracionConexion);
                const
                {
                    idAcceso,
                    correo
                } = datos;
                const Solicitud = await Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                    .input('correo',sql.VarChar,correo)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spd_Acceso');
                resultadoEliminacion =  MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoEliminacion = ErrorEnLaConfiguracionDeConexion();
            }
        }
        catch(error)
        {
            resultadoEliminacion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(ConfiguracionConexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }

}