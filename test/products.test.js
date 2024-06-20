import request from 'supertest';
import app from './setup.js';
import productsModel from '../src/models/product.model.js';

describe('Products API', () => {
    beforeEach(async () => {
        await productsModel.deleteMany({});
    });

    describe('GET /api/products', () => {
        it('Debería obtener todos los productos', (done) => {
            request(app)
                .get('/api/products')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.a('object');
                    res.body.products.should.be.a('array');
                    done();
                });
        });
    });

    describe('POST /api/products', () => {
        it('Debería crear un nuevo producto', (done) => {
            const product = {
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: 'PRD001',
                price: 100,
                stock: 10,
                category: 'Categoría de prueba',
                owner: 'test@example.com'
            };
            request(app)
                .post('/api/products')
                .send(product)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.payload.should.have.property('title').eql('Producto de prueba');
                    done();
                });
        });
    });

    describe('PUT /api/products/:id', () => {
        it('Debería actualizar un producto existente', (done) => {
            const product = new productsModel({
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: 'PRD001',
                price: 100,
                stock: 10,
                category: 'Categoría de prueba',
                owner: 'test@example.com'
            });
            product.save((err, product) => {
                request(app)
                    .put('/api/products/' + product._id)
                    .send({ price: 150 })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('success');
                        res.body.payload.should.have.property('price').eql(150);
                        done();
                    });
            });
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('Debería eliminar un producto existente', (done) => {
            const product = new productsModel({
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: 'PRD001',
                price: 100,
                stock: 10,
                category: 'Categoría de prueba',
                owner: 'test@example.com'
            });
            product.save((err, product) => {
                request(app)
                    .delete('/api/products/' + product._id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('success');
                        res.body.should.have.property('message').eql('Producto eliminado exitosamente');
                        done();
                    });
            });
        });
    });
});
