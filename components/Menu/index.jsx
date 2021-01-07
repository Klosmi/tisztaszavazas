import React from 'react';
import styled from 'styled-components'
import { useRouter } from 'next/router'

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

export default ({ onClick }) => {
  const router = useRouter()
  let { pathname } = router
  pathname = pathname.split('/')[1]

  return (
    <Menu
      onClick={onClick}
      defaultOpenKeys={['szavazokorok', 'api', 'egyedi-lekerdezesek']}
      selectedKeys={[pathname]}
      mode="inline"
    >
      <SubMenu
        key="api"
        title={
          <span>
            <span>API</span>
          </span>
        }
      >
        <Menu.ItemGroup key="szavazokorok" title="Szavazókörök">
          <Menu.Item key="szavazokorok-listaja">Összes szavazókör</Menu.Item>
          <Menu.Item key="szavazokor-adatai">Szavazókör részletek</Menu.Item>
          <Menu.Item key="szavazokorok-lakcim-szerint">Szavazókörök lakcím alapján</Menu.Item>
          <SubMenu key="egyedi-lekerdezesek" title="Egyedi lekérdezések" def>
            <Menu.Item key="oevk-telepulesei">OEVK települései és a szavazókörök száma</Menu.Item>
          </SubMenu>
        </Menu.ItemGroup>
      </SubMenu>
    </Menu>  
  )
}