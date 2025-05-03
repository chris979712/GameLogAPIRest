import request from "supertest";
import { CrearServidorTest } from "../server.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";
import { ModeloLogin } from "../api_rest/model/sql/Login";
import {ModeloJuego} from "../api_rest/model/sql/Juego.js";

let servidor;
let tokenAdmin;
let tokenJugador;
let idAdminCreado;
let idJugadorCreado;

beforeAll(async () =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloJuego:ModeloJuego});
    servidor = servidorCreado;
    const datosAdmin = 
        {
            correo: "usuarioprueba@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaJuego",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "pruebaJuego",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datosAdmin);
    const DatosAdmin = 
        {
            correo: "usuarioprueba@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
    const resLoginAdmin = await request(servidor).post('/login').set("Content-Type","application/json").send(DatosAdmin);
    tokenAdmin = resLoginAdmin.headers['access_token'];
    idAdminCreado = resLoginAdmin.body.cuenta[0].idJugador;
    const datosJugador = 
        {
            correo: "usuariopruebajugador@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaJuegador",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "pruebaJuegador",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Jugador"
        };
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datosJugador);
    const DatosJugador = 
        {
            correo: "usuariopruebajugador@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Jugador"
        }
    const resLoginJugador = await request(servidor).post('/login').set("Content-Type","application/json").send(DatosJugador);
    tokenJugador = resLoginJugador.headers['access_token'];
    idJugadorCreado = resLoginJugador.body.cuenta[0].idJugador;
})

afterAll(async() => 
{
    const datosEliminacionAdmin = {
            tipoDeUsuario: "Administrador",
            correo: "usuarioprueba@gmail.com"
        }
    await request(servidor).delete(`/acceso/${idAdminCreado}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${tokenAdmin}`
        })
        .send(datosEliminacionAdmin);
    const datosEliminacionJugador = {
        tipoDeUsuario: "Jugador",
        correo: "usuariopruebajugador@gmail.com"
    }
    await request(servidor).delete(`/acceso/${idJugadorCreado}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${tokenAdmin}`
        })
        .send(datosEliminacionJugador);
    servidor.close();
})

describe('Test para el servicio de Juegos donde se encuentran los métodos de Registro, Búsqueda y Eliminación',() =>
{
    test('POST /juego - Ingresa un nuevo juego dentro del sistema', async() => 
    {
        const Datos = {idJuego: 41437, nombre: "Fortnite battle royale"};
        const resInsercion = await request(servidor).post('/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(Datos);
        expect(resInsercion.statusCode).toBe(200);
    })

    test('POST /juego - Ingresa un juego repetido dentro del sistema', async() => 
    {
        const Datos = {idJuego: 41437, nombre: "Fortnite battle royale"};
        const resInsercion = await request(servidor).post('/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(Datos);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /juego - Ingresa un juego sin pasar parámetros', async() => 
        {
            const resInsercion = await request(servidor).post('/juego')
                .set({
                    "access_token": `Bearer ${tokenAdmin}`
                })
            expect(resInsercion.statusCode).toBe(400);
        })

    test('GET /juego/:idJuego - Buscar un juego por su ID', async() => 
    {
        const resBusqueda = await request(servidor).get(`/juego/${41437}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juego");
    })

    test('GET /juego/:idJuego - Buscar un juego inexistente por su ID', async() => 
    {
        const resBusqueda = await request(servidor).get(`/juego/${99999}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
    })

    test('GET /juego/:idJuego - Buscar un juego por su ID sin pasar parámetros', async() => 
        {
            const resBusqueda = await request(servidor).get(`/juego/${null}`)
                .set({"access_token": `Bearer ${tokenJugador}`});
            expect(resBusqueda.statusCode).toBe(400);
        })

    test('GET /juego/ - Buscar un juego a través de su nombre', async() => 
    {
        const NombreJuego = "Fortnite battle royale";
        const resBusqueda = await request(servidor).get(`/juego/?nombre=${NombreJuego}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juego");
    })

    test('GET /juego/ - Buscar un juego inexistente en la base de datos a través de su nombre', async() => 
    {
        const NombreJuego = "Halo infinite";
        const resBusqueda = await request(servidor).get(`/juego/?nombre=${NombreJuego}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
    })

    test('GET /juego/ - Buscar un juego por su nombre con datos inválidos', async() => 
        {
            const NombreJuego = "'o04p23k4i9201pol2,3{121}{}?¡¿*]";
            const resBusqueda = await request(servidor).get(`/juego/?nombre=${NombreJuego}`)
                .set({"access_token": `Bearer ${tokenJugador}`});
            expect(resBusqueda.statusCode).toBe(400);
        })

    test('DELETE /juego/:idJuego - Eliminar juego existente en la base de datos a través de su ID',async() => 
    {
        const resEliminacion = await request(servidor).delete(`/juego/${41437}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(200);
    })

    test('DELETE /juego/:idJuego - Eliminar juego inexistente en la base de datos a través de su ID',async() => 
    {
        const resEliminacion = await request(servidor).delete(`/juego/${20000}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/:idJuego - Eliminar juego con datos inválidos',async() => 
        {
            const IdJuego = "ABCDEFG" 
            const resEliminacion = await request(servidor).delete(`/juego/${IdJuego}`)
                .set({"access_token": `Bearer ${tokenAdmin}`});
            expect(resEliminacion.statusCode).toBe(400);
        })

    test('DELETE /juego/:idJuego - Eliminar juego sin pasarle parámetros',async() => 
        {
            const resEliminacion = await request(servidor).delete(`/juego/${null}`)
                .set({"access_token": `Bearer ${tokenAdmin}`});
            expect(resEliminacion.statusCode).toBe(400);
        })
})