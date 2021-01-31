module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/osszes-szavazokor/ogy2018',
        permanent: false,
      },
      {
        source: '/szavazokorok-listaja',
        destination: '/osszes-szavazokor/ogy2018',
        permanent: false,
      },
    ]
  },
}