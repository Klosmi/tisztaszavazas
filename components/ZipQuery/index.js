import { useEffect, useContext } from 'react';
import zipService from '../../services/zipService';

const ZipQuery = ({
  queryString,
  onResult = () => null
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
    zipService.aggregate(query)
    .then(({ data }) => onResult(data))
    .catch(e => console.log(e))

  }, [queryString])
  
  return  null
}

export default ZipQuery
