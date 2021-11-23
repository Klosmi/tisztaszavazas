import React from 'react'
import { useRouter } from 'next/router'
import OevkResult from '../../components/OevkResult'
import ResponsiveLayout from '../../components/ResponsiveLayout'

const Valasztokeruletek = () => {
  const router = useRouter()
  const { pathname, query: { id, election, embedded, vk_id, hide_table } } = router

  const isEmbedded = embedded === 'true'

  // TODO: kéne valami loading

  if (isEmbedded) return (
    <OevkResult
      election="ogy2018"
      isEmbedded={isEmbedded}
      initialVkId={vk_id}
      hideTable={hide_table}
      pathName={pathname}
    />    
  )

  return (
    <ResponsiveLayout menu={false}>
      <OevkResult
        election="ogy2018"
        initialVkId={vk_id}
        hideTable={hide_table}
        pathName={pathname}
      />
    </ResponsiveLayout>
  )}

export default Valasztokeruletek
