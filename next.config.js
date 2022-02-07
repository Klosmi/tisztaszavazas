module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: `/osszes-szavazokor/${process.env.NEXT_PUBLIC_DEFAULT_ELECTION}`,
        permanent: false,
      }
    ]
  },
}