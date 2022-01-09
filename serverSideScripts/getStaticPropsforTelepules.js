const tszService2 = require("../services2/tszService2")

const getStaticPropsforTelepules = async () => {
  const fs = require('fs')
  const allSettlements = fs.readFileSync(`${process.cwd()}/data/settlementsSimplified.json`, () => null)
  const allSettlementsResult = JSON.parse(allSettlements)

  let valasztokSzamaResult

  const settlementsQuery = `[
    { $group: {
      _id: "$kozigEgyseg",
      szk: { $sum: 1 },
      valasztokSzama: { $sum: "$valasztokSzama" }
    } }
  ]`

  ;({ data: valasztokSzamaResult } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query: settlementsQuery }
  }))

  const valasztokSzamaObject = valasztokSzamaResult.reduce((acc, {
    szk,
    valasztokSzama,
    _id: {
      kozigEgysegNeve,
      megyeKod,
      megyeNeve,
      telepulesKod
    }
  }) => ({
    ...acc,
    [kozigEgysegNeve?.replace('.ker', '. kerület')]: {
      szavazokorokSzama: szk,
      valasztokSzama,
      // kozigEgysegNeve,
      megyeKod,
      megyeNeve,
      telepulesKod,
    }
  }), {})

  const settlementsWithValasztokSzama = {
    features: allSettlementsResult.features.map((settlement, i) => {

      return {
      ...settlement,
      ...(valasztokSzamaObject[settlement.name] || {}),
      }
    })
  }

  return {
    props: {
      allSettlements: settlementsWithValasztokSzama
    }
  }
}

module.exports = getStaticPropsforTelepules

// ;(async () => {
//   const props = await getStaticPropsforTelepules()
//   console.log(props.props.allSettlements.features.slice(0,5))
// })()
