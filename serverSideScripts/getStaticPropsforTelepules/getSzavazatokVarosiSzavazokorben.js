const tszService2 = require("../../services2/tszService2")
const reduceSzavazatok = require( "./reduceSzavazatok" )

const getSzavazatokVarosiSzavazokorben = async () => {
  let partyAggregation
  let szavazatokVarosiSzavazokorben

  const queryFactory = partok => `[
    ${/** /''} { $limit: 500 },${/ **/''}
    { $match: {
      ${partok ? `'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },` : ''}
      'jeloles.pozicio': "Egyéni választókerületi képviselő",
      'szavazokor.kozigEgyseg.kozigEgysegNeve': "Kecskemét" ${/** //TODO: remove */''}
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
    .reduce((acc, [id, value]) => ({
      ...acc,
      [id.split(',').join(' | ')]: value
    }), {})
  )

  return szavazatokVarosiSzavazokorben
}

module.exports = getSzavazatokVarosiSzavazokorben
