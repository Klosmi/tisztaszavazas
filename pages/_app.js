import 'antd/dist/antd.css'
import { createContext, useState } from 'react';

export const AppContext = createContext()

function MyApp({ Component, pageProps }) {
  const [election, setElection] = useState('ogy2018')

  return (
    <AppContext.Provider value={{ election, setElection }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
