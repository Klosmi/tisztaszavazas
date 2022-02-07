import 'antd/dist/antd.css'
import { createContext, useState } from 'react';

export const AppContext = createContext()

function MyApp({ Component, pageProps }) {
  const [election, setElection] = useState(process.env.NEXT_PUBLIC_DEFAULT_ELECTION)

  return (
    <AppContext.Provider value={{ election, setElection }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
