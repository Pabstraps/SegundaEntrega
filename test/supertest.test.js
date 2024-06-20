import { expect } from "chai";
import supertest from 'supertest';


const requester = supertest('http://localhost:8080')




describe ("Testing de sessions", () => {

    before(function () {
        
        this.mockuser = {
            first_name: "Usuario de prueba 2",
            last_name: "Apellido de prueba 2",
            age: "25",
            email: "correodeprueba2@gmail.com",
            password: "123456"
        }
    })

    it("Test Registro: debe poder registrar correctamente un usuario", async function () {
        const {statusCode} = await requester.post('/users/register').send(this.mockuser)

        expect(statusCode).is.eql(200);
    })


    it("Test Login: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {

        const mocklogin = {
            email: this.mockuser.email,
            password: this.mockuser.password
        }

       const result = await requester.post('/api/sessions/login').send(mocklogin)
 
       

    })

})