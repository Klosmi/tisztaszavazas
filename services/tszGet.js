import axios from "axios"
import paramSerializer from './paramSerializer'

export default async ({ path, data, query, election }) => {
  const url =`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}${paramSerializer(query)}`

  const { data: d, headers } =  await axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
    headers: { 'x-valasztas-kodja': election }
  })

  return { data: d, headers }
}
