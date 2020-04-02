// handling floating point operations
const Dinero = require('dinero.js')
let store = require('./store')

function addToCart (productId, qty, cart) {
  if (!this.inCart(productId, cart)) {
    let prod = store.getProductById(productId)
    prod.qty = qty
    cart.items.push(prod)
    this.calculateTotals(cart)
  } else {
    // if in the cart, update qty
    for (let i = 0; i < this.items.length; i++) {
      const item = cart.items[i]
      if (item.id === productId) {
        const newItem = item
        newItem.qty = item.qty + qty
        cart.items.splice(i, 1, newItem)
      }
    }
  }
}

function removeFromCart (id = 0, qty, cart) {
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i]
    if (item.id === id) {
      const newItem = item
      newItem.qty = (item.qty - qty) > 0 ? item.qty - qty : 0
      cart.items.splice(i, 1, newItem)
      this.calculateTotals(cart)
    }
  }
}

function inCart (productID, cart) {
  let found = false
  cart.items.forEach(item => {
    if (item.id === productID) {
      found = true
    }
  })
  return found
}

function calculateTotals (cart) {
  cart.totals = 0.00
  cart.items.forEach(item => {
    const price = item.price
    const qty = item.qty
    const amount = price * qty
    cart.totals += Dinero(amount,'AUD').getAmount()
  })
}

function emptyCart (cart) {
  cart.items = []
  cart.totals = 0.00
}

module.exports = { addToCart, removeFromCart, inCart, calculateTotals, emptyCart }
