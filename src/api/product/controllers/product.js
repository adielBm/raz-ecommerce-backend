'use strict';

/**
 *  product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entries = await strapi.entityService.findMany('api::product.product', {
      filters: { slug: id },
    });

    const sanitizedEntity = await this.sanitizeOutput(entries[0], ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));

