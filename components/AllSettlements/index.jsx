import React, { useState, /* useEffect */ } from 'react'
// import ReactJson from 'react-json-viewer'
import {
  // Form,
  PageHeader,
  // Select,
} from 'antd';
// import tszService from '../../services/tszService'
import MapBase from '../MapBase'
import styled from 'styled-components'
// import zipService from '../../services/zipService'
import Legend from '../Legend'
// import useValasztokerulet from '../../hooks/useValasztokerulet'
// import optionFilter from '../../functions/optionFilter'
import useValasztas from '../../hooks/useValasztas';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import allSettlements from './settlementsSimplified.json'


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


const AllSettlements = ({
  election = "ogy2018",
}) => {
  const { leiras: electionDescription } = useValasztas({ election }) || {}

  const { lg } = useBreakpoint()

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
            {allSettlements.features?.map?.(({ geometry, settlementType }) => (
              <MapBase.SzkPolygon
                geometry={geometry}
                options={settlementType === 'capital' ? {
                  fillColor: "transparent",
                  strokeWeight: 3,
                } : {}}
              />
            ))}
          </MapBase>
          {/* <Legend stroke="#FF3333AA" fill="#386FB300" text="OEVK határ" /> */}
          <Legend stroke="#386FB3CC" fill="#386FB355" text="Település-határok" />
        </MapWrap>
      </Wrap>
    </>
  )
}

export default AllSettlements
