const getSzavazatokTelepulesenkent = require('./getSzavazatokTelepulesenkent')
const getVotersNumberObject = require('./getVotersNumberObject')

const getAllSettlements = async () => {
  const fs = require('fs')
  const allSettlementsResult = fs.readFileSync(`${process.cwd()}/data/settlementsSimplified.json`, () => null)
  const allSettlements = JSON.parse(allSettlementsResult)
  return allSettlements
}

const getStaticPropsforTelepules = async () => {
  return {
    props: {
      szavazatokTelepulesenkent: await getSzavazatokTelepulesenkent(),
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

// //   console.log(objFirstElems(props.props.aggregatedElectionResultsObject, 5))
// //   console.log(objFirstElems(props.props.votersNumberDataObject, 5))
// //   console.log(props.props.allSettlements.features.slice(0,5))
//   console.log(props.props.szavazatokTelepulesenkent)
// })()
