import React from 'react'
import { useRouter } from 'next/router'
import Layot from '../../components/Layout'
import SingleRecord from '../../components/SingleRecord';

const SingleSzkPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Layot>
      <SingleRecord id={id} />
    </Layot>
  )
}

export default SingleSzkPage
