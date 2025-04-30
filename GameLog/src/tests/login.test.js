import request from "supertest";
import { CrearServidorTest } from "../server.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";
import { ModeloLogin } from "../api_rest/model/sql/Login.js";

let servidor;
let token;

beforeAll(async () => 
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin});
    servidor = servidorCreado;
    const datos = 
    {
        correo: "usuarioprueba@gmail.com",
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
    await request(servidor).post("/acceso").set("Content-Type","application/json").send(datos);
})

afterAll(async() => 
{
    const correo = "usuarioprueba@gmail.com";
    const tipoDeUsuario = "Administrador";
    const resIdUsuario = await request(servidor)
        .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    const idAcceso = resIdUsuario.body.idAcceso;
    const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "usuarioprueba@gmail.com"
        }
    await request(servidor).delete(`/acceso/${idAcceso}`)
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
            correo: "usuarioprueba@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resLogin = await request(servidor).post('/login').set("Content-Type","application/json").send(DatosUsuario);
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
        const resLogin = await request(servidor).post('/login').set("Content-Type","application/json").send(DatosUsuario);
        expect(resLogin.body.mensaje).toBe("No se ha encontrado la cuenta a buscar dentro del sistema");
        expect(resLogin.statusCode).toBe(404);
    })
})