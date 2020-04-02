let request = require('request');
let server = require('../app');
let cart = require('../lib/cart');

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);


describe('Test 1 - adding to cart', () => {
    let appleProduct = {
        id: "1",
        name: "Apple",
        price: 4.95,
        qty: 2
    };
    let orangeProduct = {
        id: "2",
        name: "Orange",
        price: 3.99,
        qty: 1
    };
    let total = (appleProduct.price * appleProduct.qty) + (orangeProduct.price * orangeProduct.qty);
    it('should return the correct total', done => {
        chai.request(server)
            .post('/cart')
            .end((errorInCreateCart, responseToCreateCart) => {

                expect(responseToCreateCart).to.have.status(200);
                expect(responseToCreateCart.body).to.have.property('items');
                expect(responseToCreateCart.body.items).to.be.an('array');
                expect(responseToCreateCart.body).to.have.property('totals');
                expect(responseToCreateCart.body.totals).to.be.an('number');
                expect(responseToCreateCart.body.totals).to.eq(0);

                const sessionCookie = responseToCreateCart.headers['set-cookie'].pop().split(';')[0];
                // add apple product
                chai.request(server)
                    .post('/cart/product')
                    .set('Cookie', sessionCookie)
                    .send(appleProduct)
                    .end((error1, response1) => {

                        chai.request(server)
                            .post('/cart/product')
                            .set('Cookie', sessionCookie)
                            .send(orangeProduct)
                            .end((error2, response2) => {
                                // checks
                                chai.request(server)
                                    .get('/cart')
                                    .set('Cookie', sessionCookie)
                                    .end((error, response) => {
                                        expect(response).to.have.status(200);
                                        expect(response.body).to.have.property('totals');
                                        expect(response.body.totals).to.be.an('number');
                                        expect(response.body.totals).to.eq(total);

                                        done();
                                    });
                            });
                    });
            });
    });
});

describe('Test2 - adding and removing to/from cart', () => {
    let appleProduct = {
        id: "1",
        name: "Apple",
        price: 4.95,
        qty: 3
    };
    let removedId = 1;
    let removedQty = 1;


    let total = appleProduct.price * (appleProduct.qty - removedQty);
    it('should return the correct total', done => {
        chai.request(server)
            .post('/cart')
            .end((errorInCreateCart, responseToCreateCart) => {

                expect(responseToCreateCart).to.have.status(200);
                expect(responseToCreateCart.body).to.have.property('items');
                expect(responseToCreateCart.body.items).to.be.an('array');
                expect(responseToCreateCart.body).to.have.property('totals');
                expect(responseToCreateCart.body.totals).to.be.an('number');
                expect(responseToCreateCart.body.totals).to.eq(0);

                const sessionCookie = responseToCreateCart.headers['set-cookie'].pop().split(';')[0];
                // add apple product
                chai.request(server)
                    .post('/cart/product')
                    .set('Cookie', sessionCookie)
                    .send(appleProduct)
                    .end((errorInAdding, responseToAdding) => {
                        chai.request(server)
                            .delete('/cart/product/1/1')
                            .set('Cookie', sessionCookie)
                            .end((errorInRemoving, responseToRemoving) => {
                                // checks
                                chai.request(server)
                                    .get('/cart')
                                    .set('Cookie', sessionCookie)
                                    .end((error, response) => {
                                        expect(response).to.have.status(200);
                                        expect(response.body).to.have.property('totals');
                                        expect(response.body.totals).to.be.an('number');
                                        expect(response.body.totals).to.eq(total);

                                        done();
                                    });
                            });
                    });
            });
    });
});