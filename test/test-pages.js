let request = require('request');
let server = require('../app');
let cart = require('../lib/cart');

let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiHttp);
// chai.use(chaiAsPromised);

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

describe('Test1', () => {
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

                chai.request(server)
                    .post('/cart/product')
                    .set('Cookie', sessionCookie)
                    .send(appleProduct)
                    .end((error1, response1) => {
                        // checks
                        chai.request(server)
                            .post('/cart/product')
                            .set('Cookie', sessionCookie)
                            .send(appleProduct)
                            .end((error2, response2) => {
                                // checks
                                chai.request(server)
                                    .get('/cart')
                                    .set('Cookie', sessionCookie)
                                    .end((error, response) => {
                                        expect(response).to.have.status(200);
                                        expect(response.body).to.have.property('totals');
                                        expect(response.body.totals).to.be.an('number');
                                        expect(response.body.totals).to.eq(13.89);

                                        done();
                                    });
                            });
                    });
            });
    });
});

// describe('Cart', () => {
//     describe('GET cart/', () => {
//         let firstProduct = {
//             id: "1",
//             name: "Apple",
//             price: "4.95",
//             qty: "2"
//         };
//         let secondProduct = {
//             id: "2",
//             name: "Orange",
//             price: "3.99",
//             qty: "1"
//         };
//         let total = (firstProduct.price * firstProduct.qty) + (secondProduct.price * secondProduct.qty);
        
//         describe('Before adding products', () => {
//             it('should return false', (done) => {
//                 chai.request(server)
//                     .get('/cart')
//                     .end((error, response) => {
//                         expect(response).to.have.status(200);
//                         expect(response.body).to.eq(false);
//                         // expect(response.body).to.have.property('totals');
//                         // expect(response.body.totals).to.be.an('number');
//                         // expect(response.body.totals).to.eq(0);
//                         done();
//                     });
                
//             });
//         });
        
//         describe();

//     });
// });

// describe('Test 1', () => {

//     let firstProduct = {
//         id: "1",
//         name: "Apple",
//         price: "4.95",
//         qty: "2"
//     };
//     let secondProduct = {
//         id: "2",
//         name: "Orange",
//         price: "3.99",
//         qty: "1"
//     };
//     let total = (firstProduct.price * firstProduct.qty) + (secondProduct.price * secondProduct.qty);
//     var requester = chai.request(server).keepOpen();
//     it('total should be calculated correctly', (done) => {

//             // requester.post('/cart').send(null);
//             // requester
//             //     .post('/cart/product')
//             //     .send(firstProduct);
//             // requester
//             //     .post('/cart/product')
//             //     .send(secondProduct);
//             requester
//                 .get('/cart').end( res => {
//                     res.should.have.property('totals');
//             });
//             done();
//     });

// });
// describe('Test 2', () => {
//     let item = {
//         id: "1",
//         name: "Apple",
//         price: "4.95",
//         qty: "3"
//     };
//     let removed = 1;

//     let total = item.price * (item.qty - removed);
//     var requester = chai.request(server).keepOpen();
//     it('total should be calculated correctly', (done) => {
//         Promise.all([
//             requester.post('/cart').send(null),
//             requester
//                 .post('/cart/product')
//                 .send(item),
//             requester
//                 .delete('/cart/product/1/1'),
//             requester
//                 .get('/cart')

//         ])
//             .then(res => {
//                 return (res).should.eventually.have.property('totals').and.eql(total);
//             })
//             .then(() => requester.close());
//         done();
//     });

// });
