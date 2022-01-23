const { OEVK_ID_JOINER } = require("../../constants")
const readJsonFile = require("../readJsonFile")

const getCountiesAndOevksObject = async () => {
  const countiesAndOevks = readJsonFile('/data/countiesAndOevks.json')
  const countiesAndOevksObject = (
    countiesAndOevks
    .reduce((acc, { megyeKod, megyeNeve, szam }) => ({
      ...acc,
      [megyeKod]: {
        megyeNeve,
        ...(acc[megyeKod] || {}),
        nrOfOevks: ((acc[megyeKod] || {}).nrOfOevks || 0) + 1,
        oevkIds: [
          ...((acc[megyeKod] || {}).oevkIds || []),
          `${megyeKod}${OEVK_ID_JOINER}${szam}`
        ],
        megyeNeve
      }
    }), {})
  )

  return countiesAndOevksObject
}

module.exports = getCountiesAndOevksObject
