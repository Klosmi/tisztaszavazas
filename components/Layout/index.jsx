import React, { useState } from 'react';
import styled from 'styled-components'
import Head from 'next/head';
import {
  Layout as AntLayout
} from 'antd';

import Menu from '../Menu';
import Header from '../Header'
import ElectionSelector from '../ElectionSelector'
import { useRouter } from 'next/router'

const {
  Content: AntContent,
  Footer,
} = AntLayout

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

const Layout = ({ children, menu = true, footer = true }) => {
  const router = useRouter()
  const [selectedMenuKey, setSelectedMenuKey] = useState('szavazokorok-listaja')

  const handleMenuClick = ({key}) => {
    setSelectedMenuKey(key)
    router.push(`/${key}`)
  }

  return (
    <>
      <Head>
        <title>Tisztaszavazás</title>
      </Head>
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
      {footer && (
        <StyledFooter>
          <ElectionSelector />
        </StyledFooter>
      )}
    </>
  )
}

export default Layout
