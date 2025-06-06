import { Server } from "socket.io";
import { createServer } from "http";
import { logger } from "./utils/Logger.js";
import { CrearEventosDeSocket } from "./eventos/Eventos.js";
import { CrearSuscriptorRedis } from "./redis/RedisSub.js";
import { AutenticarUsuarioSockets } from "./middleware/Autorizacion.js";

export async function CrearServidorWebSocket(app)
{
    const ServidorHTTP = createServer(app);
    const io = new Server(ServidorHTTP,{
        cors: {
            origin: '*',
            methods: ['GET','POST','DELETE']
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 15 * 60 * 1000,
            skipMiddlewares: false
        }
    })
    io.use(AutenticarUsuarioSockets);
    CrearEventosDeSocket(io);
    CrearSuscriptorRedis(io);
    io.on('connection_error',(error) =>{
        logger({mensaje: `Error de conexion en Socket.io: ${error.message}`});
    });
    return ServidorHTTP;
}