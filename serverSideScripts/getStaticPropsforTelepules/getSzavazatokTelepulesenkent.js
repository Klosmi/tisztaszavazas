const tszService2 = require("../../services2/tszService2")
const reduceSzavazatok = require( "./reduceSzavazatok" )

const getSzavazatokTelepulesenkent = async () => {
  let partyAggregation
  let szavazatokTelepulesenkent

  const queryFactory = partok => `[
    ${/* { $limit: 50 }, */''}
    { $match: {
      ${partok ? `'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },` : ''}
      'jeloles.pozicio': "Egyéni választókerületi képviselő",
      ${/*'szavazokor.valasztokerulet.leiras': "${oevk.leiras}"*/''}
    } },
    { $group: {
      _id: "$szavazokor.kozigEgyseg.kozigEgysegNeve",
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

  szavazatokTelepulesenkent = reduceSzavazatok(partyAggregation)

  return szavazatokTelepulesenkent
}

module.exports = getSzavazatokTelepulesenkent
