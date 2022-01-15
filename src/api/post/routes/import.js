module.exports = {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/posts/import',
      handler: 'import.exampleAction',
    }
  ]
}
