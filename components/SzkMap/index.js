import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import styled from 'styled-components';
import { CONTENT_PADDING } from '../ResponsiveLayout'

const containerStyle = {
  width: '100%',
  height: '500px'
}

const options = {
  fillColor: "#386FB3",
  strokeColor: "#386FB3",
  fillOpacity: .3,
  strokeOpacity: .8,
  strokeWeight: 1,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

const Wrapper = styled.div`
  ${({ xs }) => xs ? `margin: 0 -${CONTENT_PADDING}px;` : '' }
`

const SzkMap = ({ center, polygonPath }) => {
  const { xs } = useBreakpoint()

  return (
    <Wrapper xs={xs}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          <Marker
            position={center}
          />
          <Polygon
            paths={polygonPath}
            options={options}
          />          
        </GoogleMap>
      </LoadScript>
    </Wrapper>
  )
}

export default SzkMap
