import axios from "axios"
import paramSerializer from './paramSerializer'

/* export default async ({ path, data, query }) => {
  const { data: d, headers } =  await axios({
    url: `${process.env.BASE_URL}/${path}/${paramSerializer(query)}`,
    method: 'GET',
    data
  }) */
// }
export default async ({ path, data, query }) => {
  const url =`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}${paramSerializer(query)}`

  const { data: d, headers } =  await axios({
    url,
    method: data ? 'POST' : 'GET',
    data
  })

  return { data: d, headers }
}
