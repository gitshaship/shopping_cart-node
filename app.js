'use strict';

// i have installed standard js npm module to check for StandardJS coding standard (check dev dependencies in package.json)
// run 'npx standard', it will show some errors, fix them :)

// there are some comments in lib/cart.js about static methods

// i think you should keep some products in the server
// they have asked you to design an ecommerce app, they have products and the users add them to their shopping cart
// store the products in the server in an array or an object
// and when adding them to the shopping cart, use the product name (unique) and the quantity
// the price can be taken from the server

// some comments about floating point calculations in lib/cart.js

// comments in route/routes.js

// use res.json instead of res.send for a JSON API

const config = require('./lib/config')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()

let route = require('./route/routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
    secret: config.secret,
    name: config.name
}))

app.get('/', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            totals: 0.00
        };
    }
    res.send(req.session.cart);
});
// create cart and view cart
app.route('/cart').post(route.createCart).get(route.getCart);

//add to the cart
app.route('/cart/product').post(route.addItemsToCart);

// remove item from a cart
app.route('/cart/product/:id/:qty').delete(route.removeItem);

app.route('/cart/empty').get(route.emptyCart);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
});

//Launch listening server on port 8080
app.listen(8080, function () {
    console.log('App listening on port 8080!')
});

module.exports = app;