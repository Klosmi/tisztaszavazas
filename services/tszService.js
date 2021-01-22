import axios from "axios"
import paramSerializer from './paramSerializer'
import diacriticRegex from '../functions/diacriticRegex'

const tszGet = async ({ path, data, query, election }) => {
  const url =`/api/tsz/${path}${paramSerializer(query)}`

  const { data: d, headers } =  await axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
    headers: { 'x-valasztas-kodja': election }
  })

  return { data: d, headers }
}

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

const getSingleSzk = async ({ id, election }) => {
  return await tszGet({ path: `szavazokorok/${id}`, election })
}

const getAllSzk = async ({ skip = 0, limit = 25, query = {}, election = 'ogy2018' }) => {
  query = { ...query, skip, limit }
  return await tszGet({ path: `szavazokorok${paramSerializer(query)}`, election })
}

const getSzkByAddress = async ({ city, address, houseNr }, election) => {
  const steetSide = houseNr%2 ? 'Páratlan házszámok' : 'Páros házszámok'
  
  return await tszGet({
    path: `szavazokorok`,
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

const aggregate = async ({query, election, path='szavazokorok'}) => {
  return tszGet({
    path,
    data: query,
    election
  })
}

const getCityList = async ({ citySubstr, election }) => {
  let { data } = await tszGet({
    path: 'kozigegysegek',
    query: {
      kozigEgysegNeve: `/${diacriticRegex(citySubstr)}/i`,
      limit: 50
    },
    election
  })

  data = data.map(({ _id, kozigEgysegNeve }) => ({ value: _id, label: kozigEgysegNeve }))

  return fullMatchToFirstPlace(data, citySubstr)
}

const getCityIdByName = async ({ cityName, election }) => {
  console.log({cityName})
  let { data } = await tszGet({
    path: '/kozigegysegek',
    query: { kozigEgysegNeve: cityName },
    election
  })
  return data[0]._id
}

const getSreets = async ({ cityId, election }) => { 
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
  tszGet,
  getCityIdByName,
}