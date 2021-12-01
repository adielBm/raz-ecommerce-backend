const slugify = require('slugify');

module.exports = {
  beforeCreate: (event) => {
    event.params.data.title
    if (event.params.data.title) {
      event.params.data.slug = slugify(event.params.data.title, {
        lower: true
      });
    }
  },
  beforeUpdate: (event) => {
    event.params.data.title
    if (event.params.data.title) {
      event.params.data.slug = slugify(event.params.data.title, {
        lower: true
      });
    }
  },
};
