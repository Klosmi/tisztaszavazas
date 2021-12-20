import axios from 'axios'
import paramSerializer from '../services/paramSerializer'

const tszService2 = async ({
  election,
  query,
  path,
  id,
  data,
}) => {
  const headers = { 
    'Authorization': process.env.TOKEN,
    'x-valasztas-kodja': election,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: data ? 'POST' : 'GET',
    url: `${process.env.NEXT_PUBLIC_API_BASE}/${path}${id ? `/${id}` : paramSerializer(query)}`,
    headers,
    data
  }

  return await axios(requestData)
}


export default tszService2
