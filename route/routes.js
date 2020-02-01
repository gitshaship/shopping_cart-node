const Cart = require("../lib/cart");

// these kind of functions are called middleware in express js
// routes are the paths an external user can call like GET /cart
// you can add multiple middleware for a route e.g.: get('/cart', validateGetCartRequest, getCart)
// it is not a big issue, but changing the file name to middleware would be better

function createCart(req, res){
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            totals: 0.00
        };
    }
    let cart = req.session.cart;
    res.status(200).send(cart);
}


function addItemsToCart(req, res){
    if (!req.session.cart) {
        res.status(404).send({"message":"create a cart first"});
    }
    else {
        let cart = req.session.cart;
        Cart.addToCart(req.body.product_id, req.body.name, req.body.price, req.body.qty, cart);
        res.status(200).send(cart);
    }
}

function getCart(req, res) {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.status(200).send(cart);
}

function removeItem(req, res){
    if(!req.session.cart){
        res.status(401).send("Cart is empty");
    }
    else {
        let id = parseInt(req.params.id, 10);
        let qty = parseInt(req.params.qty, 10);
        Cart.removeFromCart(id, qty, req.session.cart);
        res.status(200).send("item is removed");
    }
}

function emptyCart(req, res){
   Cart.emptyCart(req);
   res.status(200).send("cart is empty");

}

module.exports = {createCart,addItemsToCart,getCart,removeItem,emptyCart};

