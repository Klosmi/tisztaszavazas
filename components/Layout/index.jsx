import React, { createContext, useState } from 'react';
import styled from 'styled-components'
import Head from 'next/head';
import {
  Layout
} from 'antd';

import Menu from '../Menu';
import Header from '../Header'
import ElectionSelector from '../ElectionSelector'
import { useRouter } from 'next/router'

const {
  Content: AntContent,
  Footer,
} = Layout;

const Content = styled(AntContent)`
  padding: ${({ withMenu }) => withMenu ? '48px 48px 48px 304px' : '48px 48px 48px 48px'};
  margin-top: 64px;
`
const StyledFooter = styled(Footer)`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  p {
    line-height: 1;
    margin: 0;
    color: darkgrey;
  }
`

export const AppContext = createContext()

const Home = ({ children, menu = true }) => {
  const router = useRouter()
  const [election, setElection] = useState('ogy2018')
  const [selectedMenuKey, setSelectedMenuKey] = useState('szavazokorok-listaja')

  const handleMenuClick = ({key}) => {
    setSelectedMenuKey(key)
    router.push(`/${key}`)
  }

  return (
    <AppContext.Provider value={{ election, setElection }}>
      <Head>
        <title>Tisztaszavazás</title>
      </Head>
      <GlobalStyle />
      <Header />
      {menu && (
        <Menu
          onClick={handleMenuClick}
          selectedKeys={selectedMenuKey}
        />
      )}
      <Content withMenu={menu}>
        {children}
      </Content>
      <StyledFooter>
        <ElectionSelector />
      </StyledFooter>      
    </AppContext.Provider>
  )
}

export default Home
