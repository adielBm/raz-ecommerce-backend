'use strict';

const { default: axios } = require("axios");
const TurndownService = require('turndown')
const uploader = require('../../../../helpers/uploader');

/**
 * A set of functions called "actions" for `import`
 */

module.exports = {
  exampleAction: async (ctx, next) => {

    const turndownService = new TurndownService()

    const { data } = await axios.get('http://razdev.local/wp-json/wp/v2/posts?_embed');
    const posts = await Promise.all(data.map(post => new Promise(async (resolve, reject) => {

      const { title: { rendered: titleRendered }, slug, content: { rendered: contentRendered }, date } = post;

      const imgUrl = post._embedded['wp:featuredmedia'][0].source_url
      const imgId = await uploader.uploadToLibrary(imgUrl)

      try {

        const postData = {
          title: titleRendered,
          content: turndownService.turndown(contentRendered),
          slug,
          image: imgId,
          createdAt: date
        };

        const entry = await strapi.entityService.create('api::post.post', {
          data: postData
        });
        resolve(entry)

      } catch (err) {
        reject(err)
      }

    })));

    ctx.send('import completed ✅');

  }
};
