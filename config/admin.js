module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'dabcb95d45def3deafa03e1c643d7cc6'),
  },
});
