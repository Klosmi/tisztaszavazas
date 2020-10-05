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

const getSingleSzk = async (id, election) => {
  return await tszGet({ path: `/szavazokorok/${id}`, election })
}

const getAllSzk = async ({ skip = 0, limit = 25, query = {}, election = 'ogy2018' }) => {
  query = { ...query, skip, limit }
  return await tszGet({ path: `/szavazokorok${paramSerializer(query)}`, election })
}

const getSzkByAddress = async ({ city, address, houseNr }, election) => {
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
    },
    election,
  })
}

const aggregate = async (data, election) => {
  return tszGet({
    path: '/szavazokorok',
    data,
    election
  })
}

const getCityList = async (citySubstr, election) => {
  let { data } = await tszGet({
    path: '/kozigegysegek',
    query: {
      kozigEgysegNeve: `/${diacriticRegex(citySubstr)}/i`,
      limit: 50
    },
    election
  })

  data = data.map(({ _id, kozigEgysegNeve }) => ({ value: _id, label: kozigEgysegNeve }))

  return fullMatchToFirstPlace(data, citySubstr)
}

const getSreets = async (cityId, election) => { 
  let { data } = await tszGet({
    path: `/kozigegysegek/${cityId}`,
    election,
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