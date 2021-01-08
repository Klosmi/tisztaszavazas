import React from 'react'
import Layot from '../components/Layout'
import WhereVote from '../components/WhereVote'

const SzavazokorokLakcimSzerint = () => {

  const handleSzkClick = key => {
    open(`/szavazokor-adatai/${key}`)
  }

  return (
    <Layot>
      <WhereVote onSzavazokorClick={handleSzkClick} />
    </Layot>
  )
}

export default SzavazokorokLakcimSzerint
