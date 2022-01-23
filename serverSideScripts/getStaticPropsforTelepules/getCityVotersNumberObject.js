const { CITY_SZK_ID_JOINER } = require("../../constants")
const tszService2 = require("../../services2/tszService2")
const abbrevDistrictName = require("./abbrevDistrictName")
const getSzkLevelSettlements = require("./getSzkLevelSettlements")

const getCityVotersNumberObject = async () => {
  const szkLevelSettlements = getSzkLevelSettlements()

  const citiesSzkQuery = `[
    {$match: {
        $or: [
          { "kozigEgyseg.kozigEgysegNeve": {
              $in: [
                ${szkLevelSettlements}
              ]
          }},
          { "kozigEgyseg.kozigEgysegNeve": {
            $regex: "Budapest"
          }}
        ]
    }},
    {$project: {
        "valasztokSzama": 1,
        "szavazokorSzama": 1,
        "kozigEgyseg": 1,
        "szavazohelyisegHelye": 1,
        "korzethatar": 1
    }}
]`

  const { data: varosiValasztokSzamaResult } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query: citiesSzkQuery }
  })
  
  const cityVotersNumberObject = varosiValasztokSzamaResult.reduce((acc, {
    szavazokorSzama,
    valasztokSzama,
    korzethatar,
    szavazohelyisegHelye,
    kozigEgyseg: {
      kozigEgysegNeve,
      megyeNeve,
      megyeKod,
      telepulesKod,
    } = {}
  }) => {
    if (!kozigEgysegNeve) return acc
    kozigEgysegNeve = abbrevDistrictName(kozigEgysegNeve)

    return {
    ...acc,
    [`${kozigEgysegNeve}${CITY_SZK_ID_JOINER}${szavazokorSzama}`]: {
      citySzkId: `${kozigEgysegNeve}${CITY_SZK_ID_JOINER}${szavazokorSzama}`,
      kozigEgysegNeve,
      szavazokorokSzama: 1,
      valasztokSzama,
      megyeKod,
      megyeNeve,
      telepulesKod,
      korzethatar,
      szavazohelyisegHelye,      
    }
  }}, {})  

  return cityVotersNumberObject
}

module.exports = getCityVotersNumberObject
