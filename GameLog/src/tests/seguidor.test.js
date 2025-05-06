import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";
import { ModeloLogin } from "../api_rest/model/sql/Login";
import {ModeloSeguidor} from "../api_rest/model/sql/Seguidor.js";

let servidor;
let token;
let idPrimerJugador;
let idSegundoJugador;
let idTercerJugador;

beforeAll( async() =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloSeguidor:ModeloSeguidor});
    servidor = servidorCreado;
    const datosPrimerJugador =
    {
        correo: "chris@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "chris",
        primerApellido: "vasquez",
        segundoApellido: "zapata",
        nombreDeUsuario: "christolin",
        descripcion: "soy el primer jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugador =
    {
        correo: "oscar@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "oscar",
        primerApellido: "hizay",
        segundoApellido: "apodaca",
        nombreDeUsuario: "oscarin",
        descripcion: "soy el segundo jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugador =
    {
        correo: "mario@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "Mario Miguel",
        primerApellido: "Limon",
        segundoApellido: "Cabrera",
        nombreDeUsuario: "MarioFEI",
        descripcion: "soy el tercer jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datosPrimerJugador);
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datosSegundoJugador);
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datosTercerJugador);
    const datosPrimerJugadorLogin =
    {
        correo: "chris@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugadorLogin =
    {
        correo: "oscar@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugadorLogin =
    {
        correo: "mario@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const resLoginPrimerJugador = await request(servidor).post('/login').set("Content-Type","application/json").send(datosPrimerJugadorLogin);
    idPrimerJugador = resLoginPrimerJugador.body.cuenta[0].idJugador;
    token = resLoginPrimerJugador.headers['access_token'];
    const resLoginSegundoJugador = await request(servidor).post('/login').set("Content-Type","application/json").send(datosSegundoJugadorLogin);
    idSegundoJugador = resLoginSegundoJugador.body.cuenta[0].idJugador;
    const resLoginTercerJugador = await request(servidor).post('/login').set("Content-Type","application/json").send(datosTercerJugadorLogin);
    idTercerJugador = resLoginTercerJugador.body.cuenta[0].idJugador;
})

afterAll( async() =>
{
    const datosEliminacionPrimerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "chris@gmail.com"
    }
    const datosEliminacionSegundoJugador = {
        tipoDeUsuario: "Administrador",
        correo: "oscar@gmail.com"
    }
    const datosEliminacionTercerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "mario@gmail.com"
    }
    await request(servidor).delete(`/acceso/${idPrimerJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionPrimerJugador);
    await request(servidor).delete(`/acceso/${idSegundoJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionSegundoJugador);
    await request(servidor).delete(`/acceso/${idTercerJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionTercerJugador);  
    servidor.close();
})

describe('Test para el servicio de seguidores donde se encuentran los métodos de inserción, consulta y eliminación.',() =>
{
    test('POST /seguidor - Ingresa un nuevo registro de jugador a seguir', async () =>
    {
        const DatosPrimerSeguido = {idJugadorSeguidor: idPrimerJugador, idJugadorSeguido: idSegundoJugador};
        const DatosSegundoSeguido = {idJugadorSeguidor: idPrimerJugador, idJugadorSeguido: idTercerJugador};
        const resPrimerInsercion = await request(servidor).post('/seguidor')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerSeguido);
        const resSegundaInsercion = await request(servidor).post('/seguidor')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosSegundoSeguido);
        expect(resPrimerInsercion.statusCode).toBe(200);
        expect(resSegundaInsercion.statusCode).toBe(200);
    })

    test('POST /seguidor - Ingresar el mismo jugador a seguir y que ya está registrado', async () =>
    {
        const DatosPrimerSeguido = {idJugadorSeguidor: idPrimerJugador, idJugadorSeguido: idSegundoJugador};
        const resInsercion = await request(servidor).post('/seguidor')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerSeguido);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /seguidor - Ingresar el registro de un seguidor con datos inválidos', async () =>
    {
        const DatosPrimerSeguido = {idJugadorSeguidor: "askmdan", idJugadorSeguido: "alsmdkans"};
        const resInsercion = await request(servidor).post('/seguidor')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerSeguido);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /seguidor - Ingresar el registro de un seguidor sin datos como body', async () =>
    {
        const resInsercion = await request(servidor).post('/seguidor')
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resInsercion.statusCode).toBe(400);
    })

    test('GET /seguidor/seguidos - Obtener los jugadores seguidos', async() => 
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidos/${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty("seguidos");
    })

    test('GET /seguidor/seguidos - Obtener los jugadores seguidos con un jugador sin jugadores seguidos', async() => 
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidos/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(404);
    })

    test('GET /seguidor/seguidos - Obtener los jugadores seguidos ingresando parámetros inválidos', async() => 
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidos/${null}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(400);
    })

    test('GET /seguidor/seguidores - Obtener los seguidores de un jugador', async() =>
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidores/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty("seguidores");
    })

    test('GET /seguidor/seguidores - Obtener los seguidores de un jugador que no cuenta con seguidores', async() =>
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidores/${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(404);
    })

    test('GET /seguidor/seguidores - Obtener los seguidores de un jugador ingresando parámetros inválidos', async() => 
    {
        const resConsulta = await request(servidor).get(`/seguidor/seguidores/${null}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(400);
    })

    test('DELETE /seguidor/:idJugadorSeguidor/:idJugadorSeguido - Eliminar un jugador seguido', async() =>
    {
        const resPrimerEliminacion = await request(servidor).delete(`/seguidor/${idPrimerJugador}/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        const resSegundaEliminacion = await request(servidor).delete(`/seguidor/${idPrimerJugador}/${idTercerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resPrimerEliminacion.statusCode).toBe(200);
        expect(resSegundaEliminacion.statusCode).toBe(200);
    })

    test('DELETE /seguidor/:idJugadorSeguidor/:idJugadorSeguido - Eliminar un jugador seguido inexistente', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/seguidor/${idSegundoJugador}/${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /seguidor/:idJugadorSeguidor/:idJugadorSeguido - Eliminar un jugador seguido con parámetros inválidos', async() =>
    {
        const IdPrimerJugador = "ASKNJYU"
        const resEliminacion = await request(servidor).delete(`/seguidor/${IdPrimerJugador}/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resEliminacion.statusCode).toBe(400);
    })
})