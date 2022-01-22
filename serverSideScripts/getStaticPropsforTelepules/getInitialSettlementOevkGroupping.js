const tszService2 = require("../../services2/tszService2")
const getSzkLevelSettlements = require("./getSzkLevelSettlements")

const getInitialSettlementOevkGroupping = async () => {
  const szkLevelSettlements = getSzkLevelSettlements()

  const query = `
    [
      { $match: {
          "kozigEgyseg.kozigEgysegNeve": {
              $not: {
                  $in: [
                    ${szkLevelSettlements}
                  ]
              }
          }
      }},
      { $group: {
        _id: {
            kozigEgyseg: "$kozigEgyseg",
            valasztokerulet: "$valasztokerulet"
            },
        szk: { $sum: 1 },
      } },
      { $project: {
          kozigEgysegNeve: "$_id.kozigEgyseg.kozigEgysegNeve",
          megyeKod: "$_id.kozigEgyseg.megyeKod",
          valasztokeruletSzama: "$_id.valasztokerulet.szam",
          megyeNeve: "$_id.kozigEgyseg.megyeNeve",
          valasztokeruletLeirasa: "$_id.valasztokerulet.leiras",
          _id: 0

      }},
    ]
  `

  const { data } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query }
  })

  const initialSettlementOevkGroupping = (
    data.reduce((acc, {
      kozigEgysegNeve,
      megyeKod,
      valasztokeruletSzama,
    }) => {
      if (!kozigEgysegNeve) return acc

      return {
        ...acc,
        [kozigEgysegNeve]: [megyeKod, valasztokeruletSzama]
      }
    }, {})
  )

  return initialSettlementOevkGroupping
}

module.exports = getInitialSettlementOevkGroupping
