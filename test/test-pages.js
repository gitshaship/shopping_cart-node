let request = require('request');
let server = require('../app');
let cart = require('../lib/cart');

let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');
let expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Test 1', () => {

    let firstProduct = {
        id: "1",
        name: "Apple",
        price: "4.95",
        qty: "2"
    };
    let secondProduct = {
        id: "2",
        name: "Orange",
        price: "3.99",
        qty: "1"
    };
    let total = (firstProduct.price * firstProduct.qty) + (secondProduct.price * secondProduct.qty);
    var requester = chai.request(server).keepOpen();
    it('total should be calculated correctly', (done) => {

            // requester.post('/cart').send(null);
            // requester
            //     .post('/cart/product')
            //     .send(firstProduct);
            // requester
            //     .post('/cart/product')
            //     .send(secondProduct);
            requester
                .get('/cart').end( res => {
                    res.should.have.property('totals');
            });
            done();
    });

});
describe('Test 2', () => {
    let item = {
        id: "1",
        name: "Apple",
        price: "4.95",
        qty: "3"
    };
    let removed = 1;

    let total = item.price * (item.qty - removed);
    var requester = chai.request(server).keepOpen();
    it('total should be calculated correctly', (done) => {
        Promise.all([
            requester.post('/cart').send(null),
            requester
                .post('/cart/product')
                .send(item),
            requester
                .delete('/cart/product/1/1'),
            requester
                .get('/cart')

        ])
            .then(res => {
                return (res).should.eventually.have.property('totals').and.eql(total);
            })
            .then(() => requester.close());
        done();
    });

});
