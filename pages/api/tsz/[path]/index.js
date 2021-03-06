import axios from 'axios'
import packageJson from '../../../../package.json'
import paramSerializer from '../../../../services/paramSerializer'

export default async (req, res) => {
  const {
    query: { path, ...query },
    body,
    headers: {
      'x-valasztas-kodja': election
    }
  } = req

  const headers = { 
    'Authorization': process.env.TOKEN,
    'x-valasztas-kodja': election,
    'x-client-version': packageJson.version,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: body ? 'POST' : 'GET',
    url: `${process.env.NEXT_PUBLIC_API_BASE}/${path}${paramSerializer(query)}`,
    headers,
    data: body
  }

  const { data: response, headers: responseHeaders } = await axios(requestData)

  res.statusCode = 200
  for (let [key, value] of Object.entries(responseHeaders)) {
    res.setHeader(key, value)
  }

  res.json(response)
}
