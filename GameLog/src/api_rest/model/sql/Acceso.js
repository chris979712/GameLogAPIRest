import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos, ErrorEnLaConfiguracionDeConexionAcceso,ErrorEnLaBaseDeDatosAccesoInsercion, ErrorEnLaConfiguracionDeConexion, ErrorEnLaBaseDeDatos } from '../../utilidades/Constantes.js';

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
            console.log(error);
            resultadoInsercion = ErrorEnLaBaseDeDatosAccesoInsercion();
            throw error;
        }
        finally
        {
            if(sql.conected)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async EditarAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
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
            console.log(error);
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(sql.conected)
            {
                await sql.close();
            }
        }
    }

    static async EditarEstadoAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
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
                resultadoEdicion = MensajeDeRetornoBaseDeDatos(ResultadoSolicitud)
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexion();
            }
        }
        catch(error)
        {
            console.log(error);
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(sql.connect)
            {
                await sql.close();
            }
        }
    }

}