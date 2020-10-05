import axios from 'axios'
import packageJson from '../../../../package.json'
import paramSerializer from '../../../../services/paramSerializer'

export default async (req, res) => {
  const {
    query: { path, ...query },
    body
  } = req


  const baseUrl = 'https://api.tisztaszavazas.hu' 

  const headers = { 
    'Authorization': process.env.TOKEN,
    'x-valasztas-kodja': 'ogy2018', // TODO: wire to setting
    'x-client-version': packageJson.version,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: body ? 'POST' : 'GET',
    url: `${baseUrl}/${path}${paramSerializer(query)}`,
    headers,
    data: body
  }

  const { data: response, headers: responseHeaders } = await axios(requestData)

  console.log({requestData})

  res.statusCode = 200
  for (let [key, value] of Object.entries(responseHeaders)) {
    res.setHeader(key, value)
  }

  res.json(response)
}
