import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos,ErrorEnLaBaseDeDatos, ErrorEnLaConfiguracionDeConexionAcceso } from '../../utilidades/Constantes.js';

export class ModeloJugador
{
    static async ActualizarJugador({datos, tipoDeUsuario})
    {
        let resultadoModificacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const
                {
                    idJugador,
                    nombre,
                    primerApellido,
                    segundoApellido,
                    nombreDeUsuario,
                    descripcion,
                    foto
                } = datos;
                const Solicitud = conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                    .input('nombre',sql.VarChar,nombre)
                    .input('primerApellido',sql.VarChar,primerApellido)
                    .input('segundoApellido',sql.VarChar,segundoApellido)
                    .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                    .input('descripcion',sql.VarChar,descripcion)
                    .input('foto',sql.VarChar,foto)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spa_Jugadores')
                resultadoModificacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoModificacion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoModificacion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoModificacion;
    }

    static async BuscarJugador({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {
                    nombreDeUsuario
                } = datos;
                const QueryJugador = await conexion.request()
                    .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                    .query('SELECT a.idCuenta,a.correo,a.estado,j.idJugador,j.nombre,j.primerApellido,j.segundoApellido,j.nombreDeUsuario,j.descripcion,j.foto '+
                        'FROM Jugadores j JOIN Accesos a ON a.idCuenta = j.idAcceso '+
                        'WHERE j.nombreDeUsuario = @nombreDeUsuario');
                const ResultadoQueryJugador = QueryJugador.recordset;
                if(ResultadoQueryJugador.length >= 1)
                {
                    resultadoConsulta = {estado: 200, cuenta: ResultadoQueryJugador}
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado el jugador deseado a buscar.'}
                }
            }
            else
            {
                resultadoConsulta = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoConsulta = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async EliminarJugador({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const
                {
                    idJugador,
                } = datos;
                const Solicitud = await Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spd_Jugador');
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
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion
    }
}