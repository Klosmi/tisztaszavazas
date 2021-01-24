import React, { useEffect, useState, useContext } from 'react';
import List from '../List';
import tszService from '../../services/tszService';
import schema from './schema'
import { AppContext } from '../../pages/_app'

const columns = [
  { id: 'city', accessor: 'kozigEgyseg.kozigEgysegNeve', label: "Város" },
  { id: 'bon', accessor: 'szavazokorSzama', label: "Száma" },
  { id: 'addr', accessor: 'szavazokorCime', label: "Cím" },
]

export default () => {
  const [szkListResult, setSzkListResult] = useState()
  const [totalCont, setTotalCount] = useState()
  const [paginator, setPaginator] = useState({ page: 1, pageSize: 25 })
  const [isLoading, setIsLoading] = useState(false)

  const { election } = useContext(AppContext)

  const loadSzks = async ({query = {}, skip, limit}) => {
    setSzkListResult([])
    setIsLoading(true)
    const { data, headers } = await tszService.getAllSzk({ limit, skip, query, election })
    setTotalCount(+headers['x-total-count'])
    setSzkListResult(data)
    setIsLoading(false)
  }

  const handlePaginatorChagne = async (page, pageSize, query) => {
    setPaginator({page, pageSize})
    const skip = pageSize * (page - 1)
    const limit = pageSize    
    await loadSzks({query, skip, limit})
  }    

  useEffect(() => {
    loadSzks({})
  }, [election])

  return (
    <List
      listData={szkListResult}
      totalCont={totalCont}
      columns={columns}
      onPageChange={handlePaginatorChagne}
      paginator={paginator}
      isLoading={isLoading}
      onFilter={loadSzks}
      schema={schema}
      election={election}
    />
  )
}
