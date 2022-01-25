const { default: union } = require('@turf/union')

const getCountyBorders = ({ allSettlements, votersNumberDataObject }) => {
  const settlementPolygons = allSettlements.features.reduce((acc, record) => ({
    ...acc,
    [record.name]: record
  }), {})

  const settlementPolygonsByCounty = (
    Object
    .entries(votersNumberDataObject)
    .reduce((acc, [settlementName, { megyeKod, megyeNeve }]) => {
      if (!acc[megyeKod]){
        acc[megyeKod] = {
          megyeKod,
          megyeNeve,
          settlements: []
        }
      }

      acc[megyeKod].settlements.push(settlementPolygons[settlementName])
      return acc
    }, {})
  )

  let countyBorders = { type: 'FeatureCollection', features: [] }

  for (let { megyeKod, megyeNeve, settlements } of Object.values(settlementPolygonsByCounty).slice(1)){
    let megyeHatar = settlements[0]
    for (let feature of settlements){
      megyeHatar = union(megyeHatar, feature)
    }
    megyeHatar.name = megyeNeve
    megyeHatar.properties.megyeKod = megyeKod
    countyBorders.features.push(megyeHatar)
  }

  return countyBorders
}

module.exports = getCountyBorders
