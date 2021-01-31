import React, { useState, useEffect, useContext } from 'react'
import { LogoutOutlined } from '@ant-design/icons'

import {
  Collapse,
  Spin,
  Descriptions,
  Tabs,
  Table,
  Tag,
  Typography,
  Space,
  PageHeader,
} from 'antd';
import { ObjectInspector } from 'react-inspector';
import tszService from '../../services/tszService';
import styled from 'styled-components';
import SzkMap from '../SzkMap'

const { Panel } = Collapse;
const { Item } = Descriptions;
const { TabPane } = Tabs;
const { Text } = Typography;

const InspectorStyle = styled.div`
  ol > li {
    font-size: 16px !important;
    line-height: 1.5em !important;
    cursor: pointer !important;

    &[aria-expanded="true"]{
      div > span:nth-child(3){
        opacity: .3
      }
    }
  }
`

const columns = [
  {
    title: 'Közterület (rész)',
    dataIndex: 'leiras',
  },
  {
    title: 'Oldal',
    dataIndex: 'megjegyzes',
  },
]

const TabsStyled = styled(Tabs)`
  margin-top: 30px;
`

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 0;
`

const SingleRecord = ({ election, id }) => {
  const [singleSzkResult, setSingleSzkResult] = useState()

  useEffect(() => {
    ;(async () => {
      setSingleSzkResult()
      if (!id) return;
      const { data } = await tszService.getById({ path: 'szavazokorok', id, election })
      setSingleSzkResult(data)
    })();
  }, [id]);

  if (!singleSzkResult) return <Spin />

  const {
    szavazokorCime,
    szavazokorSzama,
    kozteruletek,
    kozigEgyseg: {
      kozigEgysegNeve,
      kozigEgysegSzavazokoreinekSzama,
      megyeNeve,
    },
    valasztokerulet: {
      leiras: valasztokeruletLeirasa
    },
    valasztasHuOldal,
    valasztokSzama,
    akadalymentes,
    szavazohelyisegHelye: {
      coordinates: {
        0: lng,
        1: lat
      }
    },
    korzethatar: {
      coordinates: { 0: korzethatarCoordinates }
    },
    valasztas: {
      leiras: valasztasLeirasa
    }
  } = singleSzkResult

  return (
    <>
      <PageHeaderStyled
        title={`${kozigEgysegNeve} ${szavazokorSzama}. szavazókör`}
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: valasztasLeirasa,
        }]}}
        subTitle={szavazokorCime}
      />    
      <Descriptions
        column={{ lg: 2, md: 1, sm: 1, xs: 1 }}
        bordered>
        <Item label="Választókerület">{valasztokeruletLeirasa}</Item>
        <Item label="Szavazókör címe" >{szavazokorCime}</Item>
        <Item label="Közigazgatási egység neve">{kozigEgysegNeve}</Item>
        <Item label="Szavazókör sorszáma">{szavazokorSzama}. szavazókör</Item>
        <Item label="Névjegyzékbe vettek száma" >{valasztokSzama}</Item>
        <Item label={`${megyeNeve === "Budapest" ? 'Kerület' : 'Település'} szavazóköreinek száma`} >{kozigEgysegSzavazokoreinekSzama}</Item>
        <Item label="Egyéb információk">
          {akadalymentes && <Tag color="green">akadálymentes</Tag>}
          {!akadalymentes && <Tag color="red">nem akadálymentes</Tag>}
          <a style={{ float: 'right' }} target="_new" href={`${process.env.NEXT_PUBLIC_API_BASE}${valasztasHuOldal}`}><LogoutOutlined /> Szavazókör oldala a valasztas.hu-n</a>
        </Item>
      </Descriptions>
      <TabsStyled defaultActiveKey="1">
        <TabPane tab="Térkép" key="1">
          <Space>
            <Text type="secondary">A pontos adatok a táblázatban szerepelnek, a térképi megjelenés kizárólag tájékoztató jellegű!</Text>      
          </Space>    
          <SzkMap
            center={{ lat, lng }}
            polygonPath={korzethatarCoordinates.map(([lng, lat]) => ({ lng, lat }))}
          />
        </TabPane>
        <TabPane tab="Közterületek" key="2">
          <Table
            columns={columns}
            dataSource={kozteruletek}
          />
        </TabPane>    
      </TabsStyled>
      <Collapse accordion>
        <Panel header="Nyers adatok" key="1">
          <InspectorStyle>
            <ObjectInspector
              expandLevel={Array.isArray(singleSzkResult) ? undefined : 1}
              data={singleSzkResult}
            />
          </InspectorStyle>
        </Panel>
      </Collapse>
    </>
  )
}


export default SingleRecord
