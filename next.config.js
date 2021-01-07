module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/szavazokorok-listaja',
        permanent: true,
      },
    ]
  },
}