import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion';
import {MensajeDeRetornoBaseDeDatos,ErrorEnLaConfiguracionDeConexionAcceso} from '../../utilidades/Constantes.js';

export class ModeloReseña
{
    static async RegistrarReseña({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJugador,idJuego,opinion,calificacion} = datos;
                const Solicitud = conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                    .input('idJuego',sql.Int,idJuego)
                    .input('opinion',sql.VarChar,opinion)
                    .input('calificacion',sql.Decimal(3,1),calificacion)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spi_Reseña');
                resultadoInsercion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
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

    static async ObtenerReseñasDeJugador({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJugador} = datos;
                const Solicitud = conexion.request();
                const ResultadoConsultaReseñasJugador = await Solicitud.input('idJugador',sql.Int,idJugador)
                    .query('SELECT R.idResenia,R.idJugador,J.idJuego,J.nombre,R.fecha,R.opinion,R.calificacion '+
                        'FROM Reseñas AS R '+
                        'JOIN Juegos AS J ON J.idJuego = R.idJuego '+
                        'WHERE R.idJugador = @idJugador');
                const ResultadoQueryReseñas = ResultadoConsultaReseñasJugador.recordset;
                if(ResultadoQueryReseñas.length >= 1)
                {
                    resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas}
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas'}
                }
            }
            else
            {
                resultadoConsulta = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
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

    static async ObtenerReseñasDeUnJuego({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJuego} = datos;
                const Solicitud = conexion.request();
                const ResultadoConsultaReseñasJugadores = await Solicitud.input('idJuego',sql.Int,idJuego)
                    .query('SELECT R.idResenia,J.idJugador,J.nombreDeUsuario,J.foto,JG.idJuego,JG.nombre,R.fecha,R.opinion,R.calificacion '+
                        'FROM Reseñas AS R '+
                        'JOIN Juegos AS JG ON JG.idJuego = R.idJuego '+
                        'JOIN Jugadores AS J ON R.idJugador = J.idJugador '+ 
                        'WHERE R.idJuego = @idJuego');
                const ResultadoQueryReseñas = ResultadoConsultaReseñasJugadores.recordset;
                if(ResultadoQueryReseñas.length >= 1)
                {
                    resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas}
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas por algún jugador'}
                }
            }
            else
            {
                resultadoConsulta = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
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

    static async ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJuego,idJugador} = datos;
                const Solicitud = conexion.request();
                const ResultadoConsultaReseñasJugadoresSeguidos = await Solicitud.input('idJuego',sql.Int,idJuego)
                    .input('idJugador',sql.Int,idJugador)
                    .query('SELECT R.idResenia,J.idJugador,J.nombreDeUsuario,J.foto,JG.idJuego,JG.nombre,R.fecha,R.opinion,R.calificacion '+
                        'FROM Reseñas AS R '+
                        'JOIN Juegos AS JG ON JG.idJuego = R.idJuego '+
                        'JOIN Jugadores AS J ON R.idJugador = J.idJugador '+ 
                        'JOIN Seguidor AS S ON S.idJugadorSeguido = R.idJugador '+
                        'WHERE R.idJuego = @idJuego AND S.idJugadorSeguidor = @idJugador');
                const ResultadoQueryReseñas = ResultadoConsultaReseñasJugadoresSeguidos.recordset;
                if(ResultadoQueryReseñas.length >= 1)
                {
                    resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas}
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas por jugadores seguidos'}
                }
            }
            else
            {
                resultadoConsulta = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
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

    static async EliminarReseña({datos,tipoDeUsuario})
    {
        let conexion;
        let resultadoEliminacion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idReseña} = datos;
                const Solicitud = conexion.request();
                const ResultadoEliminacion = await Solicitud.input('idReseña',sql.Int,idReseña)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spd_Reseñas');
                resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoEliminacion.output});
            }
            else
            {
                resultadoEliminacion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
        }
        catch(error)
        {
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