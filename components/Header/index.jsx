import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Layout } from 'antd';

import Logo from '../Logo';
import packageJson from '../../package.json'

const {
  Header: AndHeader,
} = Layout;

const Header = styled(AndHeader)`
  position: fixed;
  width: 100%;
  z-index: 3;
  padding: 8px 20px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoWrap = styled.a`
  height: 52px;
`

const Version = styled.span`
  float: right;
  color: gray;
  font-size: .7em;
`

const TokenAlert = styled.span`
  color: red;
`

export default () => {
  // const ipcRenderer = electron.ipcRenderer || false;
  const [tokenInputValue, setTokenInputValue] = useState()

  useEffect(() => {
    // if (ipcRenderer) {
      // const { token } = ipcRenderer.sendSync('get-config')
      setTokenInputValue(process.env.TOKEN)
    // }
  }, [])

  return (
    <Header>
      <LogoWrap href="https://tisztaszavazas.hu" target="_new">
        <Logo width={150} />
      </LogoWrap>
      {/*!tokenInputValue && <TokenAlert>Adjon meg egy érvényes személyes kulcsot a beállításokban és indítsa újra a programot.</TokenAlert>*/}
      <Version>{packageJson.version}</Version>
    </Header>
  )
}
