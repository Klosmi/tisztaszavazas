const getAllSettlements = require("./getAllSettlements")

const getSzkLevelSettlements = () => {
  const szkLevelSettlements = (
    getAllSettlements()
    .features
    .filter(({ szavazokoriBontas }) => szavazokoriBontas)
    .reduce((acc, {name}, i) => {
      return `${acc}${i ? ', ' : ''}"${name}"`
    }, '')
  )

  return szkLevelSettlements
}

module.exports = getSzkLevelSettlements
