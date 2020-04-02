const Cart = require('../models/cart')

function createCart (req, res, next) {
  try {
    if (!req.session.cart) {
      req.session.cart = {
        items: [],
        totals: 0.00
      }
    }
    const cart = req.session.cart
    res.status(200).json(cart)
  } catch (err) {
    next(err)
  }
}

function addItemsToCart (req, res, next) {
  try {
    if (!req.session.cart) {
      res.status(404).json('message', 'create a cart first')
    } else {
      const cart = req.session.cart
      Cart.addToCart(req.body.id, req.body.qty, cart)
      res.status(200).json(cart)
    }
  } catch (err) {
    next(err)
  }
}

function getCart (req, res, next) {
  try {
    const sess = req.session
    const cart = (typeof sess.cart !== 'undefined') ? sess.cart : false
    res.status(200).json(cart)
  } catch (error) {
    next(error)
  }
}

function removeItem (req, res, next) {
  try {
    if (!req.session.cart) {
      res.status(404).json('message', 'cart is empty')
    } else {
      const id = parseInt(req.params.id, 10)
      const qty = parseInt(req.params.qty, 10)
      Cart.removeFromCart(id, qty, req.session.cart)
      res.status(200).json('message', 'item is removed')
    }
  } catch (err) {
    next(err)
  }
}

function emptyCart (req, res, next) {
  try {
    if (req.session) {
      Cart.emptyCart(req.session.cart)
    }
    res.status(200).json('message', 'cart is empty')
  } catch (err) {
    next(err)
  }
}

module.exports = { createCart, addItemsToCart, getCart, removeItem, emptyCart }
