import React, { useEffect, useState } from 'react';
import List from '../List';
import tszService from '../../services/tszService';
import schema from './schema'

const columns = [
  { id: 'city', accessor: 'kozigEgyseg.kozigEgysegNeve', label: "Város" },
  { id: 'bon', accessor: 'szavazokorSzama', label: "Száma" },
  { id: 'addr', accessor: 'szavazokorCime', label: "Cím" },
]

export default ({ onClickRecord }) => {
  const [szkListResult, setSzkListResult] = useState()
  const [totalCont, setTotalCount] = useState()
  const [paginator, setPaginator] = useState({ page: 1, pageSize: 25 })
  const [isLoading, setIsLoading] = useState(false)

  const loadSzks = async ({query = {}, skip, limit}) => {
    setSzkListResult([])
    setIsLoading(true)
    const { data, headers } = await tszService.getAllSzk({ limit, skip, query })
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
    ;(async () => {
      await loadSzks({})
    })();
  }, [])

  return (
    <List
      listData={szkListResult}
      totalCont={totalCont}
      onSelectSzk={onClickRecord}
      columns={columns}
      onPageChange={handlePaginatorChagne}
      paginator={paginator}
      isLoading={isLoading}
      onFilter={loadSzks}
      schema={schema}
    />
  )
}
