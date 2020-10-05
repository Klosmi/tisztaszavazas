import paramSerializer from './paramSerializer'
import diacriticRegex from '../functions/diacriticRegex'
import tszGet from './tszGet'


const fullMatchToFirstPlace = (data, citySubstr) => (
  data.reduce((acc, option) => {
    if (option.label.match(new RegExp(`^${diacriticRegex(citySubstr)}$`, 'i'))) {
      acc.unshift(option)
    } else {
      acc.push(option)
    }
    return acc
  }, [])
)

const getSingleSzk = async (id) => {
  return await tszGet({ path: `/szavazokorok/${id}` })
}

const getAllSzk = async ({ skip = 0, limit = 25, query = {} }) => {
  query = { ...query, skip, limit }
  return await tszGet({ path: `/szavazokorok${paramSerializer(query)}` })
}

const getSzkByAddress = async ({ city, address, houseNr }) => {
  const steetSide = houseNr%2 ? 'Páratlan házszámok' : 'Páros házszámok'
  
  return await tszGet({
    path: `/szavazokorok`,
    query: {
      'kozigEgyseg.kozigEgysegNeve': `${city}`,
      'kozteruletek.kozteruletNev': address,
      'kozteruletek.kezdoHazszam': houseNr && `{ $lte: ${houseNr} }`,
      'kozteruletek.vegsoHazszam': houseNr && `{ $gte: ${houseNr} }`,
      'kozteruletek.megjegyzes': houseNr && `/${steetSide}|Teljes közterület|Folyamatos házszámok/`,
      limit: 200,
    }
  })
}

const aggregate = async data => {
  return tszGet({
    path: '/szavazokorok',
    data
  })
}

const getCityList = async citySubstr => {
  let { data } = await tszGet({
    path: '/kozigegysegek',
    query: {
      kozigEgysegNeve: `/${diacriticRegex(citySubstr)}/i`,
      limit: 50
    }
  })

  data = data.map(({ _id, kozigEgysegNeve }) => ({ value: _id, label: kozigEgysegNeve }))

  return fullMatchToFirstPlace(data, citySubstr)
}

const getSreets = async cityId => { 
  let { data } = await tszGet({
    path: `/kozigegysegek/${cityId}`
  })

  if (!data.kozteruletek) return []

  return data.kozteruletek.map(({ kozteruletNev }) => ({ value: kozteruletNev }))
}

export default {
  getAllSzk,
  getSingleSzk,
  getSzkByAddress,
  aggregate,
  getCityList,
  getSreets,
}