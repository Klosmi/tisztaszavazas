import 'antd/dist/antd.css'
import '../styles/antdWithOverwrites.less'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
