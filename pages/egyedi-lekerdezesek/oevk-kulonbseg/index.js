import { Select, Form } from 'antd';
import { useRouter } from 'next/router';

import ResponsiveLayout from '../../../components/ResponsiveLayout'
import tszService2 from '../../../services2/tszService2'


const OevkKulonbseg = ({
  pageError,
  vkList,
}) => {
  if (pageError){
    return <div>{pageError}</div>
  }

  const router = useRouter()

  const vkOptions = (
    vkList
    ?.sort((a, b) => a.leiras < b.leiras ? -1 : 1)
    .map(({ _id: value, leiras: label }) => ({ value, label }))
  )

  const handleVkSelect = vkId => {
    router.push(`oevk-kulonbseg/${vkId}`)
  }

  return (
    <ResponsiveLayout
      menu={false}
      isEmbedded={false}
      >
        <Form.Item label="Válsztókerület">
          <Select
            showSearch
            placeholder="Választókerület keresése"
            onSelect={handleVkSelect}
            options={vkOptions}
            notFoundContent={<div>Betöltés...</div>}
          />
        </Form.Item>
    </ResponsiveLayout>
  )
}

export async function getStaticProps() {
  let vkList
  let pageError = null

  try {
    ;({ data: vkList } = await tszService2({
      path: 'valasztokeruletek',
      query: { limit: 200 },
      election: 'ogy2018'
    }))

  } catch(error){
    console.log(error)
    pageError = error.message
  }

  return {
    props: {
      pageError,
      vkList,
    }
  }
}


export default OevkKulonbseg
