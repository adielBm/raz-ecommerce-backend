'use strict';

/**
 * delivery service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::delivery.delivery');
