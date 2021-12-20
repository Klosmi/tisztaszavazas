import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Layout } from 'antd';

import Logo from '../Logo';
import packageJson from '../../package.json'

const {
  Header: AndHeader,
} = Layout;

const AndHeaderStyled = styled(AndHeader)`
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

export default function Header () {
  return (
    <AndHeaderStyled>
      <LogoWrap href="/">
        <Logo width={150} />
      </LogoWrap>
      <Version>{packageJson.version}</Version>
    </AndHeaderStyled>
  )
}
