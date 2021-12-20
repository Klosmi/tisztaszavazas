import axios from 'axios'
import paramSerializer from '../services/paramSerializer'

const zipService2 = async ({
  query,
  path,
  id,
  data,
}) => {
  const headers = { 
    'Authorization': process.env.TOKEN,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: data ? 'POST' : 'GET',
    url: `${process.env.NEXT_PUBLIC_ZIP_API_BASE}/${path}${id ? `/${id}` : paramSerializer(query)}`,
    headers,
    data
  }

  return await axios(requestData)
}


export default zipService2
