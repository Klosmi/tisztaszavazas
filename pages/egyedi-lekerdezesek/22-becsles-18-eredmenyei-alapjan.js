import React from 'react'
import { useRouter } from 'next/router'
import OevkResult from '../../components/OevkResult'
import ResponsiveLayout from '../../components/ResponsiveLayout'

const Valasztokeruletek = () => {
  const router = useRouter()
  const { id, election, embedded, vk_id, hide_table } = router.query

  const isEmbedded = embedded === 'true'

  return (
    <ResponsiveLayout menu={false} isEmbedded={isEmbedded}>
      <OevkResult
        election="ogy2018"
        isEmbedded={isEmbedded}
        initialVkId={vk_id}
        hideTable={hide_table}
      />
    </ResponsiveLayout>
  )}

export default Valasztokeruletek
