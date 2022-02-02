const { CITY_SZK_ID_JOINER } = require("../../constants")
const tszService2 = require("../../services2/tszService2")
const getSzkLevelSettlements = require("./getSzkLevelSettlements")

const getInitialCitySzkOevkGroupping = async () => {
  const szkLevelSettlements = getSzkLevelSettlements()
  

  const query = `
    [
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
      { $project: {
        szavazokorSzama: 1,
        varosNeve: "$kozigEgyseg.kozigEgysegNeve",
        megyeKod: "$kozigEgyseg.megyeKod",
        valasztokeruletSzama: "$valasztokerulet.szam",

        _id: 0
      }}
    ]
  `

  const { data } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query }
  })  

  const initialCitySzkOevkGroupping = (
    data.reduce((acc, {
      szavazokorSzama,
      varosNeve,
      megyeKod,
      valasztokeruletSzama,
    }) => {
      if (!varosNeve || !szavazokorSzama) return acc

      varosNeve = varosNeve.replace('Budapest ', 'BP ').replace('.ker', '')

      return {
        ...acc,
        [`${varosNeve}${CITY_SZK_ID_JOINER}${szavazokorSzama}`]: [megyeKod, valasztokeruletSzama]
      }
    }, {})
  )

  return initialCitySzkOevkGroupping
}

module.exports = getInitialCitySzkOevkGroupping