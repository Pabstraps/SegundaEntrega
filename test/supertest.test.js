import { expect } from "chai";
import supertest from 'supertest';


const requester = supertest('http://localhost:8080')


describe("Test de productos", () => {

    describe("Test crear productos", async () => {
        const productMock = {
            title: "NES",
            description: "Nintendo",
            code: "123123123",
            price: "1300",
            stock: "2",
            category: "software"
        }

      const result = await requester.post("/api/products/").send(productMock)
        console.log(result);

    })



})




// describe ("Testing de login and sessions with cookies", () => {

//     before(function () {
//         this.cookie;
//         this.mockuser = {
//             first_name: "Usuario de prueba 2",
//             last_name: "Apellido de prueba 2",
//             email: "correodeprueba2@gmail.com",
//             password: "123456"
//         }
//     })

//     it("Test Registro: debe poder registrar correctamente un usuario", async function () {
//         const {statusCode} = await requester.post('/api/sessions/register).send(this.mockuser')

//         expect(statusCode).is.eql(200);
//     })


//     it("Test Login: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {

//         const mocklogin = {
//             email: this.mockuser.email,
//             password: this.mockuser.password
//         }

//        const result = await requester.post('api/sessions/login').send(mocklogin)
//        console.log (result)
       

//     })


//     // it("Test ruta protegida: Debe enviar la cookie que contiene el usuario y destructurarla correctamente.")


// })