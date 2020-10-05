import React from 'react';
import styled from 'styled-components'

import {
  Menu as AntMenu,
} from 'antd';

const { SubMenu } = AntMenu;

const Menu = styled(AntMenu)`
  width: 256px;
  height: 100vh;
  position: fixed;
  top: 64px;
`

export default ({ onClick, selectedKeys }) => (
  <Menu
    onClick={onClick}
    defaultOpenKeys={['sub1']}
    selectedKeys={selectedKeys}
    mode="inline"
  >
    <SubMenu
      key="sub1"
      title={
        <span>
          <span>API</span>
        </span>
      }
    >
      <Menu.ItemGroup key="g1" title="Szavazókörök">
        <Menu.Item key="all-szk">Összes szavazókör</Menu.Item>
        <Menu.Item key="single-szk">Szavazókör részletek</Menu.Item>
        <Menu.Item key="where-vote">Hol szavazok?</Menu.Item>
        <Menu.Item key="custom-query">Egyedi lekérdezések</Menu.Item>
      </Menu.ItemGroup>
    </SubMenu>
  </Menu>  
)