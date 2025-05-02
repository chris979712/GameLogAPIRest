import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion';
import { MensajeDeRetornoBaseDeDatos,ErrorEnLaBaseDeDatos, ErrorEnLaConfiguracionDeConexionAcceso } from '../../utilidades/Constantes.js';

export class ModeloJuego
{
    static async RegistrarJuego({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJuego,nombre} = datos;
                const Solicitud = conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJuego',sql.Int,idJuego)
                    .input('nombre',sql.VarChar,nombre)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spi_Juegos')
                resultadoInsercion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async BuscarJuego({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {nombre} = datos;
                const Solicitud = conexion.request()
                    .input('nombre',sql.VarChar,nombre)
                    .query('SELECT j.idJuego, j.nombre '+
                            'FROM Juegos j '+
                            'WHERE j.nombre = @juego');
                const ResultadoQueryJuego = Solicitud.recordset;
                if(ResultadoQueryJuego.length >= 1)
                {
                    resultadoConsulta = {estado: 200, juego: ResultadoQueryJuego.idJuego};
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado el juego deseado a buscar.'}
                }
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }

    static async EliminarJuego({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJuego} = datos;
                const Solicitud = conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJuego',sql.Int,idJuego)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spd_Juegos')
                resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }
}