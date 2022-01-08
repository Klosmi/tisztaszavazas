import React, { useState, /* useEffect */ } from 'react'
// import ReactJson from 'react-json-viewer'
import {
  Drawer,
  PageHeader,
  Descriptions,
} from 'antd';
import MapBase from '../MapBase'
import styled from 'styled-components'
import Legend from '../Legend'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import allSettlements from './settlementsSimplified.json'
import TisztaszavazasLogo from '../TisztaszavazasLogo';



const Wrap = styled.div`
  display: flex;
  flex-direction: ${({ horizontal }) => horizontal ? 'row' : 'column' };
`

const MapWrap = styled.div`
  width: 100%;
`

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

const TisztaszavazasLogoStyled = styled(TisztaszavazasLogo).attrs({ width: 140 })``

const DrawerFooter = styled.div`
  position: absolute;
  bottom: 10px;
`

const AllSettlements = ({
  election = "ogy2018",
}) => {
  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const { lg } = useBreakpoint()

  const [activeSettlement, setActiveSettlement] = useState(null)

  const handleClickPolygon = (settlementId) => {
    const settlement = allSettlements.features.find(({ _id }) => _id === settlementId)  
    setActiveSettlement(settlement)
  }

  return (
    <>
      <PageHeaderStyled
        title="Magyarország települései"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionDescription || '...',
        }]}}
      />
      <Wrap horizontal={lg}>
        <MapWrap>
          <MapBase
            center={{ lat: 47, lng: 19 }}
            zoom={7.5}
            mapId="85b71dbefa7b82fa"
          >
            {allSettlements.features?.map?.(({ geometry, settlementType, _id: settlementId }) => (
              <MapBase.SzkPolygon
                key={settlementId}
                geometry={geometry}
                onClick={() => handleClickPolygon(settlementId)}
                options={{
                  ...(settlementId == activeSettlement?._id ? {
                    strokeOpacity: 1,
                    strokeColor: 'black',
                    strokeWeight: 3,
                    zIndex: 5,
                  }: {
                    strokeOpacity: .5,
                    strokeColor: "#386FB3",
                    strokeWeight: 1,
                    zIndex: 1
                  }),
                  ...(settlementType === 'capital' ? {
                    fillColor: "transparent",
                    strokeWeight: 3,
                    clickable: true,                
                    }: {}),                  
                }}
              />
            ))}
          </MapBase>
          {/* <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" /> */}
          <Legend stroke="#386FB3CC" fill="#386FB355" text="Település-határok" />
        </MapWrap>
        <Drawer
            visible={!!activeSettlement}
            onClose={() => setActiveSettlement(null)}
            maskClosable={false}
            mask={false}
            >
              {activeSettlement && (
                <Descriptions column={1} title={
                  <>
                    <p>{activeSettlement.name}</p>
                  </>
                } layout="vertical">
                </Descriptions>
              )}
              <DrawerFooter>
                <TisztaszavazasLogoStyled />
              </DrawerFooter>
          </Drawer>         
      </Wrap>
    </>
  )
}

export default AllSettlements
