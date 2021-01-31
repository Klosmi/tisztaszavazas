import React from 'react'
import { useRouter } from 'next/router'
import AllRecords from '../../components/AllRecords';
import ResponsiveLayout from '../../components/ResponsiveLayout';

const OsszesSzavazokor = () => {
  const router = useRouter()
  const { election } = router.query

  return (
    <ResponsiveLayout>
      <AllRecords election={election} />
    </ResponsiveLayout>
  )
}

export default OsszesSzavazokor
