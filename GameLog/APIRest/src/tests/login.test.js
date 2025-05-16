import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";

let servidor;
let token;
let codigoDeVerificacion;

beforeAll(async () => 
{
    const {server: servidorCreado} = CrearServidorTest({ModeloLogin:ModeloLogin,ModeloAcceso:ModeloAcceso});
    servidor = servidorCreado;
    const datos = 
    {
        correo: "chrisvasquez985@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "pruebaLogin",
        primerApellido: "prueba",
        segundoApellido: "prueba",
        nombreDeUsuario: "prueba",
        descripcion: "login",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datos);
})

afterAll(async() => 
{
    const correo = "chrisvasquez985@gmail.com";
    const tipoDeUsuario = "Administrador";
    const resIdUsuario = await request(servidor)
        .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    const idAcceso = resIdUsuario.body.idAcceso;
    const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "chrisvasquez985@gmail.com"
        }
    await request(servidor).delete(`/gamelog/acceso/${idAcceso}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(datosEliminacion);
    servidor.close();
})

describe('Test para probar el login de cuentas a la API REST', () => 
{
    test('POST /login - Se Accede a la API Rest desde una cuenta existente', async() => {
        const DatosUsuario = 
        {
            correo: "chrisvasquez985@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosUsuario);
        expect(resLogin.body).toHaveProperty("cuenta");
        expect(resLogin.statusCode).toBe(200);
        expect(resLogin.headers).toHaveProperty('access_token');
        token = resLogin.headers['access_token'];
    })

    test('POST /login - Se intenta acceder a la API desde una cuenta que no está registrada en la base de datos', async() => {
        const DatosUsuario = 
        {
            correo: "vasquezchris986@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosUsuario);
        expect(resLogin.body.mensaje).toBe("No se ha encontrado la cuenta a buscar dentro del sistema");
        expect(resLogin.statusCode).toBe(404);
    })

    test('POST /login - Se intenta acceder a la API sin ingresar datos para inicio de sesion', async() => {
        const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json");
        expect(resLogin.statusCode).toBe(400);
    })

    test('POST /login - Se intenta acceder a la API con datos inválidos', async() => {
        const DatosUsuario = 
        {
            correo: "'p´llpfa",
            contrasenia: " ",
            tipoDeUsuario: "Administrador"
        }
        const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosUsuario);
        console.log(resLogin.body)
        expect(resLogin.statusCode).toBe(400);
    })

    test('POST /login/recuperacionDeCuenta - Se intenta obtener un código de verificación para cambiar las credenciales de acceso', async() => {
        const DatosUsuario = 
        {
            correo: "chrisvasquez985@gmail.com",
            tipoDeUsuario: "Administrador"
        }
        const resRecuperacionDeCuenta = await request(servidor).post('/gamelog/login/recuperacionDeCuenta').set("Content-Type","application/json").send(DatosUsuario);
        codigoDeVerificacion = resRecuperacionDeCuenta.body.codigo;
        expect(resRecuperacionDeCuenta.statusCode).toBe(200);
    })

    test('POST /login/recuperacionDeCuenta - Se intenta obtener un código de verificación para cambiar las credenciales de acceso de un correo no registrado', async() => {
        const DatosUsuario = 
        {
            correo: "vasquezchris986@gmail.com",
            tipoDeUsuario: "Administrador"
        }
        const resRecuperacionDeCuenta = await request(servidor).post('/gamelog/login/recuperacionDeCuenta').set("Content-Type","application/json").send(DatosUsuario);
        expect(resRecuperacionDeCuenta.statusCode).toBe(404);
    })

    test('POST /login/recuperacionDeCuenta - Se intenta obtener un código de verificación para cambiar las credenciales de acceso con datos inválidos', async() => {
        const DatosUsuario = 
        {
            correo: "pko90o2k3p1",
            tipoDeUsuario: "Administrador"
        }
        const resRecuperacionDeCuenta = await request(servidor).post('/gamelog/login/recuperacionDeCuenta').set("Content-Type","application/json").send(DatosUsuario);
        expect(resRecuperacionDeCuenta.statusCode).toBe(400);
    })

    test('POST /login/recuperacionDeCuenta/validacion - Se intenta verificar un código inválido', async() =>
    {
        const DatosUsuario = 
        {
            correo: "chrisvasquez985@gmail.com",
            tipoDeUsuario: "Administrador",
            codigo: 123456
        }
        const resValidacion = await request(servidor).post('/gamelog/login/recuperacionDeCuenta/validacion').set("Content-Type","application/json").send(DatosUsuario);
        console.log(resValidacion.body)
        expect(resValidacion.statusCode).toBe(404);
    })

    test('POST /login/recuperacionDeCuenta/validacion -Se ingresa un correo del cual no se ha solicitado ningún código de verificación', async() =>
    {
        const DatosUsuario = 
        {
            correo: "vasquezchris986@gmail.com",
            tipoDeUsuario: "Administrador",
            codigo: 123456
        }
        const resValidacion = await request(servidor).post('/gamelog/login/recuperacionDeCuenta/validacion').set("Content-Type","application/json").send(DatosUsuario);
        console.log(resValidacion.body)
        expect(resValidacion.statusCode).toBe(400);
    })

    test('POST /login/recuperacionDeCuenta/validacion - Se verifica un código de cambio de credenciales de manera exitosa', async() =>
    {
        const DatosUsuario = 
        {
            correo: "chrisvasquez985@gmail.com",
            tipoDeUsuario: "Administrador",
            codigo: codigoDeVerificacion
        }
        const resValidacion = await request(servidor).post('/gamelog/login/recuperacionDeCuenta/validacion').set("Content-Type","application/json").send(DatosUsuario);
        console.log(resValidacion.body)
        expect(resValidacion.statusCode).toBe(200);
    })

    test('POST /login/recuperacionDeCuenta/validacion - Se intenta verificar un código con datos inválidos', async() =>
    {
        const DatosUsuario = 
        {
            correo: "qke0i'123p1gmail.com",
            tipoDeUsuario: "Administrador",
            codigo: "pdjajiwoewk"
        }
        const resValidacion = await request(servidor).post('/gamelog/login/recuperacionDeCuenta/validacion').set("Content-Type","application/json").send(DatosUsuario);
        expect(resValidacion.statusCode).toBe(400);
    })

})