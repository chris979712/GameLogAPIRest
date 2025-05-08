import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import {MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloReseña
{
    static async RegistrarReseña({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
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
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugador = await Solicitud.input('idJugador',sql.Int,idJugador)
                .query('SELECT DISTINCT R.idResenia,R.idJugador,J.idJuego,J.nombre,R.fecha,R.opinion,R.calificacion,ISNULL(L.totalDeLikes,0) AS totalDeLikes '+
                    'FROM Reseñas AS R '+
                    'JOIN Juegos AS J ON J.idJuego = R.idJuego '+
                    'OUTER APPLY dbo.fn_ObtenerLikesDeReseña(R.idResenia) AS L '+
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
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugadores = await Solicitud.input('idJuego',sql.Int,idJuego)
                .query('SELECT DISTINCT R.idResenia,J.idJugador,J.nombreDeUsuario,J.foto,JG.idJuego,JG.nombre,R.fecha,R.opinion,R.calificacion,ISNULL(L.totalDeLikes,0) AS totalDeLikes '+
                    'FROM Reseñas AS R '+
                    'JOIN Juegos AS JG ON JG.idJuego = R.idJuego '+
                    'JOIN Jugadores AS J ON R.idJugador = J.idJugador '+
                    'OUTER APPLY dbo.fn_ObtenerLikesDeReseña(R.idResenia) AS L '+
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
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugadoresSeguidos = await Solicitud.input('idJuego',sql.Int,idJuego)
                .input('idJugador',sql.Int,idJugador)
                .query('SELECT DISTINCT R.idResenia,J.idJugador,J.nombreDeUsuario,J.foto,JG.idJuego,JG.nombre,R.fecha,R.opinion,R.calificacion,ISNULL(L.totalDeLikes,0) AS totalDeLikes '+
                    'FROM Reseñas AS R '+
                    'JOIN Juegos AS JG ON JG.idJuego = R.idJuego '+
                    'JOIN Jugadores AS J ON R.idJugador = J.idJugador '+ 
                    'JOIN Seguidor AS S ON S.idJugadorSeguido = R.idJugador '+
                    'OUTER APPLY dbo.fn_ObtenerLikesDeReseña(R.idResenia) AS L '+
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
            conexion = await sql.connect(ConfiguracionConexion);
            const {idReseña} = datos;
            const Solicitud = conexion.request();
            const ResultadoEliminacion = await Solicitud.input('idReseña',sql.Int,idReseña)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Reseñas');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoEliminacion.output});
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