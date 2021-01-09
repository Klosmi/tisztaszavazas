import axios from 'axios'

export default async (req, res) => {
  const {
    query: { path, id },
    data
  } = req

  const headers = { 
    'Authorization': process.env.TOKEN,
    'Content-Type': 'application/json',
  }

  const requestData = {
    method: data ? 'POST' : 'GET',
    url: `${process.env.NEXT_PUBLIC_ZIP_API_BASE}/${path}/${id}`,
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
