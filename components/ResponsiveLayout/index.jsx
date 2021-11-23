import { Layout, Menu } from 'antd'
import Head from 'next/head'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import styled from "styled-components"
import { useRouter } from 'next/router'
import Logo from '../Logo';
import { useEffect, useState } from 'react';
import GlobalStyle from '../GlobalStyle'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import {
  RadarChartOutlined,
  CompassOutlined,
  BarsOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Item } = Menu

const HeaderStyled = styled(Header)`
  ${({ dark, breakpoints: { xs } }) => dark ? `
    background: #000;
    padding: 0 0 0 ${xs ? 10 : 32}px;
  ` : `
    background: #fff;
    padding: 0;
  ` }; 
`

const LogoStyled = styled(Logo)`
  margin: 12px 0 0 6px;
`

const menuStyle = `
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
`

const MenuUnfold = styled(MenuUnfoldOutlined)([menuStyle])
const MenuFold = styled(MenuFoldOutlined)([menuStyle])

const LayoutStyled = styled(Layout)`
  height: auto;
  min-height: 100vh;
`

export const CONTENT_PADDING = 16

const ContentStyled = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
  ${({ breakpoints: { xs } }) => {
    if (xs) return `
      padding: 0 ${CONTENT_PADDING}px;
      margin: 0;
    `
    return 'padding: 24px;'
  }}
`

const SiderStyled = styled(Sider)`
  position: sticky;
  top: 0;
  height: 100vh;
  ${({ zerowidth }) => zerowidth ? `
    &.ant-layout-sider-collapsed {
      width: 0px !important;
      max-width: 0px !important;
      min-width: unset !important;
      overflow: hidden;
    }
  `: ''}
`

const ResponsiveLayout = ({ children, menu = true, isEmbedded }) => {
  const [collapsed, setCollapsed] = useState()
  const [hideIfCollapsed, setHideIfCollapsed] = useState()

  const breakpoints = useBreakpoint()

  const router = useRouter()
  let { pathname, query } = router
  pathname = pathname.split('/')[1]  

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    setCollapsed(!breakpoints.md)
    setHideIfCollapsed(breakpoints.xs)
  }, [breakpoints])

  const handleMenuClick = ({key}) => {
    router.push(`/${key}`)
  }

  const hideMenu = hideIfCollapsed && collapsed

  return (
    <LayoutStyled>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />      
        <title>Tisztaszavazás</title>
        <meta property="og:title" content="Tiszta szavazás" key="title" />
        <meta property="og:description" content="Minden, amit a választásokról tudni kell." />
        <meta property="og:image" content="https://app.tisztaszavazas.hu/tisztaszavazas-banner.jpg" />
        <meta property="og:url" content="http://app.tisztaszavazas.hu" />        
      </Head>      
      {menu && !isEmbedded && (
        <SiderStyled
          trigger={null}
          collapsible
          zerowidth={hideMenu}
          collapsed={collapsed}>
          <LogoStyled
            height={45}
            minimal={collapsed}
          />
          <Menu
            theme="dark"
            mode="inline"
            onClick={handleMenuClick}
            selectedKeys={[`${pathname}/${query.election}`]}
            >
            <Item
              icon={<BarsOutlined />}          
              key={`osszes-szavazokor/${query.election}`}>
              Összes szavazókör
            </Item>
            <Item
              icon={<CompassOutlined />}
              key={`szavazokorok-lakcim-alapjan/${query.election}`}>
              Szavazókörök lakcím alapján
            </Item>
            <Item
              icon={<RadarChartOutlined />}
              key={`valasztokeruletek/${query.election}`}>
              Választókerületek
            </Item>
          </Menu>
        </SiderStyled>
      )}
      <LayoutStyled>
        {!isEmbedded && (
          <HeaderStyled breakpoints={breakpoints} dark={!menu}>
            {menu && (
              React.createElement(collapsed ? MenuUnfold : MenuFold, {
                onClick: toggle,
              })
            )}
            {!menu && (
              <LogoStyled
                height={45}
                minimal={collapsed}
              />            
            )}
          </HeaderStyled>
        )}
        <ContentStyled breakpoints={breakpoints}>
          {children}
        </ContentStyled>
      </LayoutStyled>
    </LayoutStyled>
  )
}

export default ResponsiveLayout
