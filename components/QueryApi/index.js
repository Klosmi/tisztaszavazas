import { useEffect } from 'react';

const QueryApi = ({
  queryString,
  onResult = () => null,
  promise
}) => {
  useEffect(() => {
    if (!queryString) return
    let query
    try {
      query = JSON.parse(queryString)
    } catch(e){
      console.log(e)
      return
    }
    promise(query)
    .then(({ data }) => onResult(data))
    .catch(e => console.log(e))

  }, [queryString])
  
  return  null
}

export default QueryApi
