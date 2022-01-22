const tszService2 = require("../../services2/tszService2")
const getSzkLevelSettlements = require("./getSzkLevelSettlements")

const getInitialCitySzkOevkGroupping = async () => {
  const szkLevelSettlements = getSzkLevelSettlements()
  

  const query = `
    [
      {$match: 
          { "kozigEgyseg.kozigEgysegNeve": {
              $in: [
                ${szkLevelSettlements}
              ]
          }}          
          
      },
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

      return {
        ...acc,
        [`${varosNeve} | ${szavazokorSzama}`]: [megyeKod, valasztokeruletSzama]
      }
    }, {})
  )

  return initialCitySzkOevkGroupping
}

module.exports = getInitialCitySzkOevkGroupping
