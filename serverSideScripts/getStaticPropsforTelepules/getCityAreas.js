const readJsonFile = require( '../readJsonFile' )

const getCityAreas = () => {
  const cityAreas = readJsonFile('/data/cityAreas.json')
  return cityAreas
}

module.exports = getCityAreas
