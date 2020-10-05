import axios from 'axios'
import packageJson from '../../../package.json'
import paramSerializer from '../../../services/paramSerializer'

export default async (req, res) => {
  const {
    query: { path, ...query },
    data
  } = req
  // const query = req.query
  // const data = req.data

  // console.log({req})

  const baseUrl = 'https://api.tisztaszavazas.hu' 

  const headers = { 
    'Authorization': process.env.TOKEN,
    'x-valasztas-kodja': 'ogy2018', // TODO: wire to setting
    'x-client-version': packageJson.version,
    'Content-Type': 'application/json',
  }
  
  const { data: response, headers: responseHeaders } = await axios({
    method: data ? 'POST' : 'GET',
    url: `${baseUrl}/${path}${paramSerializer(query)}`,
    headers,
    data
  })

  console.log(responseHeaders)

  res.statusCode = 200
  res.json(response)
  // res.statusCode = 200
  // res.json('hello')  
}
