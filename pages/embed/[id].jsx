import { useRouter } from 'next/router'
import OevkCities from '../../components/OevkCities'


const savedEmbeds = {
  'abcdefgh': {
    Layout: OevkCities,
    params: {
      oevkSzama: 1,
      showSearch: false
    }
  }
}

const Embed = () => {
  const router = useRouter()
  const { id } = router.query
  const { Layout, params } = savedEmbeds[id] || {}

  if (Layout){
    return <Layout {...params} />
  }

  return null
}

export default Embed