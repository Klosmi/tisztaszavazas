import axios from "axios"
import paramSerializer from './paramSerializer'

const zipGet = async ({ path, body: data, query }) => {
  const url =`/api/zip/${path}${paramSerializer(query)}`

  const { data: d, headers } =  await axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
  })

  return { data: d, headers }
}

const getAllZips = async ({ skip = 0, limit = 25, query = {} }) => {
  query = { ...query, skip, limit }
  return await zipGet({ path: `/zipcodes${paramSerializer(query)}` })
}

const aggregate = ({ query, path = '/zipcodes' }) => (
  zipGet({
    path,
    body: query,
  })
)

const getCity = ({ zip }) => (
  zipGet({
    path: '/zipcodes',
    query: { zip }
  })
)

export default {
  getAllZips,
  aggregate,
  getCity,
}
