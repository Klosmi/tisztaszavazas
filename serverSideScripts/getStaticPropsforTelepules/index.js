const getSzavazatokTelepulesenkent = require('./getSzavazatokTelepulesenkent')
const getVotersNumberObject = require('./getVotersNumberObject')
const readJsonFile = require( '../readJsonFile' )
const getCountiesAndOevksObject = require('./getCountiesAndOevksObject')

const allSettlements = readJsonFile('/data/settlementsSimplified.json')

const getStaticPropsforTelepules = async () => {
  return {
    props: {
      szavazatokTelepulesenkent: await getSzavazatokTelepulesenkent(),
      votersNumberDataObject: await getVotersNumberObject(),
      allSettlements,
      countiesAndOevksObject: await getCountiesAndOevksObject (),
    }
  }
}

module.exports = getStaticPropsforTelepules

;(async () => {
  const objFirstElems = (obj, max) => {
    return Object.entries(obj).reduce((acc, [key, value], i) => {
      return i <= max ? {
        ...acc,
        [key]: value
      } : acc
    }, {})
  }
  const props = await getStaticPropsforTelepules()

//   console.log(objFirstElems(props.props.aggregatedElectionResultsObject, 5))
//   console.log(objFirstElems(props.props.votersNumberDataObject, 5))
//   console.log(props.props.allSettlements.features.slice(0,5))
  // console.log(props.props.countiesAndOevksObject)
})()
