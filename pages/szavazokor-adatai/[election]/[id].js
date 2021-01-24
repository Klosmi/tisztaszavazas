import React from 'react'
import { useRouter } from 'next/router'
import Layot from '../../../components/Layout'
import SingleRecord from '../../../components/SingleRecord';

const SingleSzkPage = () => {
  const router = useRouter()
  const { id, election } = router.query

  return (
    <Layot menu={false}>
      <SingleRecord id={id} election={election} />
    </Layot>
  )
}

export default SingleSzkPage
