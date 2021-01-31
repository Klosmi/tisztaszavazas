import React from 'react'
import { useRouter } from 'next/router'
import ResponsiveLayout from '../../components/ResponsiveLayout'
import WhereVote from '../../components/WhereVote'

const SzavazokorokLakcimAlapjan = () => {
  const router = useRouter()
  const { election } = router.query

  const handleSzkClick = key => {
    open(`/szavazokor-adatai/${election}/${key}`)
  }

  return (
    <ResponsiveLayout>
      <WhereVote
        election={election}
        onSzavazokorClick={handleSzkClick}
      />
    </ResponsiveLayout>
  )
}

export default SzavazokorokLakcimAlapjan
