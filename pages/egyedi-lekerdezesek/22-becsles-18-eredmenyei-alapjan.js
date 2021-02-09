import React from 'react'
// import { useRouter } from 'next/router'
import OevkResult from '../../components/OevkResult'
import ResponsiveLayout from '../../components/ResponsiveLayout'

const Valasztokeruletek = () => {
  // const router = useRouter()
  // const { id, election } = router.query

  return (
    <ResponsiveLayout menu={false}>
      <OevkResult election="ogy2018" />
    </ResponsiveLayout>
  )}

export default Valasztokeruletek
