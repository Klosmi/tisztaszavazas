const tszService2 = require("../../services2/tszService2")
const reduceSzavazatok = require( "./reduceSzavazatok" )
const getSzkLevelSettlements = require("./getSzkLevelSettlements")
const abbrevDistrictName = require("./abbrevDistrictName")
const { CITY_SZK_ID_JOINER } = require("../../constants")

const getSzavazatokVarosiSzavazokorben = async () => {
  let partyAggregation
  let szavazatokVarosiSzavazokorben

  const szkLevelSettlements = getSzkLevelSettlements()

  const queryFactory = partok => `[
    { $match: {
      $or: [
        { "szavazokor.kozigEgyseg.kozigEgysegNeve": {
            $in: [
              ${szkLevelSettlements}
            ]
        }},
        { "szavazokor.kozigEgyseg.kozigEgysegNeve": {
          $regex: "Budapest"
        }}
      ],
      ${partok ? `'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },` : ''}
      'jeloles.pozicio': "Egyéni választókerületi képviselő",      
    } },
    { $group: {
      _id: ["$szavazokor.kozigEgyseg.kozigEgysegNeve", "$szavazokor.szavazokorSzama"],
      szavazatok: { $sum: "$ervenyesSzavazat" }
    } }
  ]`

  const partyAggregationQuery = `[
    { $facet: {
      fidesz: ${queryFactory(['FIDESZ'])},
      ellenzek: ${queryFactory(['MSZP', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP', 'EGYUTT'])},
      osszes: ${queryFactory()}
    }},
  ]`

  ;({ data: partyAggregation } = await tszService2({
    election: 'ogy2018',
    path: 'szavazatok',
    data: { query: partyAggregationQuery }
  }))

  szavazatokVarosiSzavazokorben = reduceSzavazatok(partyAggregation)

  szavazatokVarosiSzavazokorben = (
    Object.entries(szavazatokVarosiSzavazokorben)
    .reduce((acc, [id, value]) => {
      let [cityName, szkNr] = id.split(',')
      const citySzkId = `${abbrevDistrictName(cityName)}${CITY_SZK_ID_JOINER}${szkNr}`

      return {
        ...acc,
        [citySzkId]: value
    }}, {})
  )

  return szavazatokVarosiSzavazokorben
}

module.exports = getSzavazatokVarosiSzavazokorben
