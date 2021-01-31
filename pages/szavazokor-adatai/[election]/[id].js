import React from 'react'
import { useRouter } from 'next/router'
import SingleRecord from '../../../components/SingleRecord';
import ResponsiveLayout from '../../../components/ResponsiveLayout';

const SingleSzkPage = () => {
  const router = useRouter()
  const { id, election } = router.query

  return (
    <ResponsiveLayout menu={false} footer={false}>
      <SingleRecord id={id} election={election} />
    </ResponsiveLayout>
  )
}

export default SingleSzkPage
