import React, { useState, useEffect, useContext } from 'react';

import {
  Collapse,
  Spin,
  Descriptions,
  Tabs,
  Table,
  Tag,
  Typography,
  Space,
} from 'antd';
import { ObjectInspector } from 'react-inspector';
import tszService from '../../services/tszService';
import styled from 'styled-components';
import { AppContext } from '../../pages';
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

export default ({ id }) => {
  const [singleSzkResult, setSingleSzkResult] = useState()

  const { election } = useContext(AppContext)

  useEffect(() => {
    ;(async () => {
      setSingleSzkResult()
      if (!id) return;
      const { data } = await tszService.getSingleSzk(id, election)
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
    }
  } = singleSzkResult

  return (
    <>
  <Descriptions column={2} title={szavazokorCime}>
  
    <Item>{kozigEgysegNeve}</Item>
    <Item>{valasztokeruletLeirasa}</Item>
    <Item>{szavazokorSzama}. szavazókör</Item>
    <Item label="Névjegyzékbe vettek száma" >{valasztokSzama}</Item>
    <div>
      {akadalymentes && <Tag color="green">akadálymentes</Tag>}
      {!akadalymentes && <Tag color="red">nem akadálymentes</Tag>}
    </div>
    <Item label={`${megyeNeve === "Budapest" ? 'Kerület' : 'Település'} szavazóköreinek száma`} >{kozigEgysegSzavazokoreinekSzama}</Item>
    <Item><a target="_new" href={`${process.env.NEXT_PUBLIC_API_BASE}${valasztasHuOldal}`}>Szavazókör oldala a valasztas.hu-n</a></Item>
  </Descriptions>
  <Tabs defaultActiveKey="1">
    <TabPane tab="Közterületek" key="1">
      <Table
        columns={columns}
        dataSource={kozteruletek}
      />
    </TabPane>
    <TabPane tab="Térkép" key="2">
      <Space>
        <Text type="secondary">A pontos adatok a táblázatban szerepelnek, a térképi megjelenés kizárólag tájékoztató jellegű!</Text>      
      </Space>    
      <SzkMap
        center={{ lat, lng }}
        polygonPath={korzethatarCoordinates.map(([lng, lat]) => ({ lng, lat }))}
      />
    </TabPane>
  </Tabs>
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
