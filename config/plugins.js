module.exports = {
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
}