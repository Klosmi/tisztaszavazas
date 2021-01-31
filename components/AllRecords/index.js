import React, { useEffect, useState } from 'react';
import List from '../List';
import tszService from '../../services/tszService';
import schema from './schema'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const AllRecords = ({ election }) => {
  const [szkListResult, setSzkListResult] = useState()
  const [totalCont, setTotalCount] = useState()
  const [paginator, setPaginator] = useState({ page: 1, pageSize: 25 })
  const [isLoading, setIsLoading] = useState(false)

  const { md } = useBreakpoint()

  const columns = [
    { id: 'city', accessor: 'kozigEgyseg.kozigEgysegNeve', label: "Város" },
    { id: 'bon', accessor: 'szavazokorSzama', label: "Száma" },
  ]

  if (md) columns.push({ id: 'addr', accessor: 'szavazokorCime', label: "Cím" },)

  const loadSzks = async ({query = {}, skip, limit}) => {
    setSzkListResult([])
    setIsLoading(true)
    const { data, headers } = await tszService.getAllSzk({ limit, skip, query, election })
    setTotalCount(+headers['x-total-count'])
    setSzkListResult(data)
    setIsLoading(false)
  }

  const electionData = useValasztas({ election })

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
      electionDescription={electionData?.leiras}
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

export default AllRecords
