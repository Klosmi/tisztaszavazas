import axios from 'axios'
import packageJson from '../../../../package.json'

export default async (req, res) => {
  const {
    query: { path, id },
    data
  } = req

  const baseUrl = 'https://api.tisztaszavazas.hu' 

  const headers = { 
    'Authorization': process.env.TOKEN,
    'x-valasztas-kodja': 'ogy2018', // TODO: wire to setting
    'x-client-version': packageJson.version,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: data ? 'POST' : 'GET',
    url: `${baseUrl}/${path}/${id}`,
    headers,
    data
  }

  const { data: response, headers: responseHeaders } = await axios(requestData)

  res.statusCode = 200
  for (let [key, value] of Object.entries(responseHeaders)) {
    res.setHeader(key, value)
  }

  res.json(response)
}
