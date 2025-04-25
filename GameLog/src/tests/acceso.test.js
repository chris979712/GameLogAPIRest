import request  from "supertest";
import { CrearServidorTest } from "../server.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";

let servidor;

beforeAll(async () => {
    const { app, server: servidorCreado } = CrearServidorTest({ModeloAcceso : ModeloAcceso});
    servidor = servidorCreado;
});

afterAll(async () => {
    servidor.close();
});

describe('Test para el modelo de Acceso (Creaciond de cuenta, edicion de cuenta y estado de la cuenta)', () => 
{
    test('POST /acceso - Se crea una nueva cuenta de acceso', async () => 
    {
        const datos = 
        {
            correo: "oscarcito666@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "Oscar",
            primerApellido: "Hizay",
            segundoApellido: "Apodaca",
            nombreDeUsuario: "Garcia",
            descripcion: " ",
            foto: "fuego",
            tipoDeUsuario: "Administrador"
        };
        const res = await request(servidor)
            .post("/acceso")
            .set("Content-Type","application/json")
            .send(datos)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje");
        expect(res.body.mensaje).toBe("La nueva cuenta de acceso ha sido registrada correctamente")
    })
})