// Importa las dependencias necesarias
import {expect} from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

const request = supertest(app);

describe('Testing Cart APIs', () => {

 
  let cartId;

  // Prueba POST /api/cart/:cid/products para agregar un producto al carrito
  it('POST /api/cart/:cid/products should add a product to the cart', async () => {
    const productId = '6631592d0ea4e097e5067279'; 

    const response = await request.post(`/api/cart/${cartId}/products`)
      .send({ productId });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message').equal('Product added to cart successfully');
  });

  // Prueba GET /api/cart/:cid para obtener el carrito con productos
  it('GET /api/cart/:cid should return the cart with products', async () => {
    const response = await request.get(`/api/cart/${cartId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('products').that.is.an('array');
  });

  // Antes de cada prueba, crea un nuevo carrito para usar en las pruebas
  beforeEach(async () => {
    const createCartResponse = await request.post('/api/cart')


    cartId = createCartResponse.body.cart._id;
  });


  afterEach(async () => {
    if (cartId) {
      await request.delete(`/api/cart/${cartId}`);
    }
  });

});
