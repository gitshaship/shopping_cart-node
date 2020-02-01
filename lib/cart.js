const config = require('./config');

// here a class in not really necessary
// because you only use static methods and you are not using any instance variables
// you can achieve the same functionality by removing the class and writing functions and exporting them using module.exports
// some people don't like static methods at all, so better to change it

// floating point operations are not accurate in javascript or any other language
// if you add 4.95 + 3.99 the answer is 8.940000000000001, so not accurate
// rounding off won't be acceptable especially if you are working with monetary values, like in an ecommerce application
// there are many libraries to do these calculations, i have used dinero.js before, but there are many libraries

class Cart {

    static addToCart(productId, name, price, qty, cart) {
        if(!this.inCart(productId, cart)) {
             let prod = {
                id: parseInt(productId,10),
                name: name,
                price: price,
                qty: qty
            };
            cart.items.push(prod);
            this.calculateTotals(cart);
        }
    }

    static removeFromCart(id = 0, qty,  cart) {
        for(let i = 0; i < cart.items.length; i++) {
            let item = cart.items[i];
            if(item.id === id) {
                let newItem = item;
                newItem.qty = (item.qty-qty)>0?item.qty-qty:0;
                cart.items.splice(i,1,newItem);
                this.calculateTotals(cart);
            }
        }

    }

    static inCart(productID = 0, cart) {
        let found = false;
        cart.items.forEach(item => {
            if(item.id === productID) {
                found = true;
            }
        });
        return found;
    }

    static calculateTotals(cart) {
        cart.totals = 0.00;
        cart.items.forEach(item => {
            let price = item.price;
            let qty = item.qty;
            let amount = price * qty;

            cart.totals += amount;
        });

    }

    static emptyCart(request) {

        if(request.session) {
            request.session.cart.items = [];
            request.session.cart.totals = 0.00;
        }

    }

}
module.exports = Cart;