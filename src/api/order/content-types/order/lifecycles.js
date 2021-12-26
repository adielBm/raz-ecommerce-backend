const { randomBytes } = require("crypto");

module.exports = {
  beforeCreate: (event) => {

    const code = randomBytes(8).toString("hex");
    event.params.data.code = code
    
  },
  beforeUpdate: async (event) => {

    const id = event.params.where.id

    const entries = await strapi.entityService.findOne('api::order.order', id, {
      populate: {
        delivery: true,
        items: {
          populate: {
            product: true,
          },
        },
      },
    })

    const reducer = (previousValue, currentValue) => {
      return previousValue + (currentValue.product.price * currentValue.count)
    }

    const totalItems = entries.items.reduce(reducer, 0)
    const total = totalItems + entries.delivery.cost
    event.params.data.total = total

  },
};
