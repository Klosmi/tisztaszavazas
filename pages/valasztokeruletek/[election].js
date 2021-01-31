import React from 'react'
import { useRouter } from 'next/router'
import OevkCities from '../../components/OevkCities'
import ResponsiveLayout from '../../components/ResponsiveLayout'

const Valasztokeruletek = () => {
  const router = useRouter()
  const { id, election } = router.query

  return (
    <ResponsiveLayout>
      <OevkCities election={election} />
    </ResponsiveLayout>
  )}

export default Valasztokeruletek
