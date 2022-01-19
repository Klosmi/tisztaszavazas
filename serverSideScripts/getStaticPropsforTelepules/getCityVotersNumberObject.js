const tszService2 = require("../../services2/tszService2")
const getAllSettlements = require("./getAllSettlements")

const getCityVotersNumberObject = async () => {
  const szkLevelSettlements = (
    getAllSettlements()
    .features
    .filter(({ szavazokoriBontas }) => szavazokoriBontas)
    .reduce((acc, {name}, i) => {
      return `${acc}${i ? ', ' : ''}"${name}"`
    }, '')
  )

  const citiesSzkQuery = `[
    {$match: {
        $or: [
            { "kozigEgyseg.kozigEgysegNeve": {
                $in: [
                  ${szkLevelSettlements}
                ]
            }},
${/*              { "kozigEgyseg.kozigEgysegNeve": { // TODO: add Budapest */''}
${/*                  $regex: "Budapest"  */''}
${/*              }}              */''}
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
    kozigEgysegNeve = kozigEgysegNeve && kozigEgysegNeve.replace('.ker', '. kerület')

    return {
    ...acc,
    [`${kozigEgysegNeve} | ${szavazokorSzama}`]: {
      citySzkId: `${kozigEgysegNeve} | ${szavazokorSzama}`,
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
