import React from 'react'
import Layot from '../../components/Layout'
import OevkCities from '../../components/OevkCities'
import { AppContext } from '../_app'

const OEVKTelepulesei = () => {
  const context = useContext(AppContext)

  return (
    <Layot>
      <OevkCities {...context} />
    </Layot>
  )}

export default OEVKTelepulesei
