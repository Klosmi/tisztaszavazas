const getSzavazatokTelepulesenkent = require('./getSzavazatokTelepulesenkent')
const getVotersNumberObject = require('./getVotersNumberObject')
const getCountiesAndOevksObject = require('./getCountiesAndOevksObject')
const getCityVotersNumberObject = require('./getCityVotersNumberObject')
const getAllSettlements = require('./getAllSettlements')
const getSzavazatokVarosiSzavazokorben = require('./getSzavazatokVarosiSzavazokorben')
const getInitialSettlementOevkGroupping = require('./getInitialSettlementOevkGroupping')
const getInitialCitySzkOevkGroupping = require('./getInitialCitySzkOevkGroupping')
const getCountyBorders = require('./getCountyBorders')


const getStaticPropsforTelepules = async () => {
  const votersNumberDataObject = await getVotersNumberObject()
  const allSettlements = getAllSettlements()


  return {
    props: {
      szavazatokTelepulesenkent: await getSzavazatokTelepulesenkent(),
      votersNumberDataObject,
      allSettlements,
      countiesAndOevksObject: await getCountiesAndOevksObject(),
      cityVotersNumberObject: await getCityVotersNumberObject(),
      szavazatokVarosiSzavazokorben: await getSzavazatokVarosiSzavazokorben(),
      initialSettlementOevkGroupping: await getInitialSettlementOevkGroupping(),
      initialCitySzkOevkGroupping: await getInitialCitySzkOevkGroupping(),
      countyBorders: getCountyBorders({ allSettlements, votersNumberDataObject })
    }
  }
}

module.exports = getStaticPropsforTelepules

// ;(async () => {
//         // const objFirstElems = (obj, max) => {
//         //   return Object.entries(obj).reduce((acc, [key, value], i) => {
//         //     return i <= max ? {
//         //       ...acc,
//         //       [key]: value
//         //     } : acc
//         //   }, {})
//         // }

//   const props = await getStaticPropsforTelepules()

//         //   console.log(objFirstElems(props.props.aggregatedElectionResultsObject, 5))
//         // console.log(objFirstElems(props.props.votersNumberDataObject, 5))
//         //   console.log(props.props.allSettlements.features.slice(0,5))
//         // console.log(props.props.countiesAndOevksObject)
//         // console.log(props.props.cityVotersNumberObject)
//         // console.log(props.props.szavazatokVarosiSzavazokorben)
//         // console.log(props.props.initialSettlementOevkGroupping)
//         // console.log(props.props.initialCitySzkOevkGroupping)
//         // console.log(props.props.szavazatokTelepulesenkent)
//         console.log(props.props.countyBorders)

// })()
