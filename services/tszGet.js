import axios from "axios"
import paramSerializer from './paramSerializer'

export default async ({ path, data, query, election }) => {
  const url =`/api/tsz/${path}${paramSerializer(query)}`

  const { data: d, headers } =  await axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
    headers: { 'x-valasztas-kodja': election }
  })

  return { data: d, headers }
}
