const readJsonFile = require( '../readJsonFile' )

const getAllSettlements = () => {
  const allSettlements = readJsonFile('/data/settlementsSimplified.json')
  return allSettlements
}

module.exports = getAllSettlements
