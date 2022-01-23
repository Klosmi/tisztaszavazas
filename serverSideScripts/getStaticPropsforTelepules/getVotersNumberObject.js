const tszService2 = require("../../services2/tszService2")
const abbrevDistrictName = require("./abbrevDistrictName")

const getVotersNumberObject = async () => {
  const settlementsQuery = `[
    { $group: {
      _id: "$kozigEgyseg",
      szk: { $sum: 1 },
      valasztokSzama: { $sum: "$valasztokSzama" }
    } },
  ]`

  const { data: valasztokSzamaResult } = await tszService2({
    election: 'ogy2018',
    path: 'szavazokorok',
    data: { query: settlementsQuery }
  })

  
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
    kozigEgysegNeve = kozigEgysegNeve && abbrevDistrictName(kozigEgysegNeve)

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

module.exports = getVotersNumberObject
