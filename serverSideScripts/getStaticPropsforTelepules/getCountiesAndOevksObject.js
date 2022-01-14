const readJsonFile = require("../readJsonFile")

const getCountiesAndOevksObject = async () => {
  const countiesAndOevks = readJsonFile('/data/countiesAndOevks.json')
  const countiesAndOevksObject = (
    countiesAndOevks
    .reduce((acc, { megyeKod, megyeNeve }) => ({
      ...acc,
      [megyeKod]: {
        ...(acc[megyeKod] || {}),
        nrOfOevks: ((acc[megyeKod] || {}).nrOfOevks || 0) + 1,
        megyeNeve
      }
    }), {})
  )

  return countiesAndOevksObject
}

module.exports = getCountiesAndOevksObject
