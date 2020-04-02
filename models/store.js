function getProductById(id) {
    const product = [{
            'id': 1,
            'name': "Apple",
            'price': 4.95
        },
        {
            'id': 2,
            'name': "Orange",
            'price': 3.99
        }];

    for (let i = 0; i < product.length; i++) {
        let item = product[i];
        if (item.id == id) {
            return item
        }
    }
}

module.exports = {getProductById};


