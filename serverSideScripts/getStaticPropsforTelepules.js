const tszService2 = require("../services2/tszService2")

const getAggregatedElectionResultsObject = async () => {
  let partyAggregation
  let aggregatedElectionResultsObject

  const reduceToTelepules = partyAggregation => {
    const resultsObject = {}
    for (let [partyName, settlmentResults] of Object.entries(partyAggregation)){
      for (let { _id: settlementName, szavazatok } of settlmentResults) {
        resultsObject[settlementName] = {
          ...(resultsObject[settlementName] || {}),
          [partyName]: szavazatok
        }
      }
    }

    return resultsObject
  }

  const getQuery = partok => `[
    { $match: {
      ${partok ? `'jeloles.jelolo.szervezet.rovidNev': { $in: ${JSON.stringify(partok)} },` : ''}
      'jeloles.pozicio': "Egyéni választókerületi képviselő"
    } },
    { $group: {
      _id: "$szavazokor.kozigEgyseg.kozigEgysegNeve",
      szavazatok: { $sum: "$ervenyesSzavazat" }
    } },
  ]`

  const partyAggregationQuery = `[
    { $facet: {
      fidesz: ${getQuery(['FIDESZ'])},
      ellenzek: ${getQuery(['MSZP', 'JOBBIK', 'DK', 'MOMENTUM', 'LMP', 'EGYUTT'])},
      osszes: ${getQuery()}
    }},
  ]`

  ;({ data: partyAggregation } = await tszService2({
    election: 'ogy2018',
    path: 'szavazatok',
    data: { query: partyAggregationQuery }
  }))



  aggregatedElectionResultsObject = reduceToTelepules(partyAggregation[0])
  return aggregatedElectionResultsObject
}

const getAllSettlements = async () => {
  const fs = require('fs')
  const allSettlementsResult = fs.readFileSync(`${process.cwd()}/data/settlementsSimplified.json`, () => null)
  const allSettlements = JSON.parse(allSettlementsResult)
  return allSettlements
}

const getVotersNumberObject = async () => {
  const settlementsQuery = `[
    { $group: {
      _id: "$kozigEgyseg",
      szk: { $sum: 1 },
      valasztokSzama: { $sum: "$valasztokSzama" }
    } },
  ]`

  ;({ data: valasztokSzamaResult } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query: settlementsQuery }
  }))

  
  const votersNumberObject = valasztokSzamaResult.reduce((acc, {
    szk,
    valasztokSzama,
    _id: {
      kozigEgysegNeve,
      megyeKod,
      megyeNeve,
      telepulesKod
    } = {}
  }) => {
    if (!kozigEgysegNeve) return acc
    kozigEgysegNeve = kozigEgysegNeve && kozigEgysegNeve.replace('.ker', '. kerület')

    return {
    ...acc,
    [kozigEgysegNeve]: {
      szavazokorokSzama: szk,
      valasztokSzama,
      // kozigEgysegNeve,
      megyeKod,
      megyeNeve,
      telepulesKod,
    }
  }}, {})  

  return votersNumberObject
}


const getStaticPropsforTelepules = async () => {
  return {
    props: {
      aggregatedElectionResultsObject: await getAggregatedElectionResultsObject(),
      votersNumberDataObject: await getVotersNumberObject(),
      allSettlements: await getAllSettlements()
    }
  }
}

module.exports = getStaticPropsforTelepules

// ;(async () => {
//   const objFirstElems = (obj, max) => {
//     return Object.entries(obj).reduce((acc, [key, value], i) => {
//       return i <= max ? {
//         ...acc,
//         [key]: value
//       } : acc
//     }, {})
//   }
//   const props = await getStaticPropsforTelepules()

//   console.log(objFirstElems(props.props.aggregatedElectionResultsObject, 5))
//   console.log(objFirstElems(props.props.votersNumberDataObject, 5))
//   console.log(props.props.allSettlements.features.slice(0,5))
// })()
