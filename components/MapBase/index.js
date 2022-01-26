import React, { useRef } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker as MarkerImport,
  Polygon as PolygonImport,
  Polyline
} from '@react-google-maps/api'
import styled from 'styled-components';

const geoJsonToPaths = coordinates => coordinates.map(polyArray => polyArray.map(([lng, lat]) => ({ lng, lat })))

export const ControlPosition_LEFT_CENTER = 4

export const defaultPolygonOptions = {
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
}

export const szkPolygonOptions = {
  ...defaultPolygonOptions,
  fillColor: "#386FB3",
  strokeColor: "#386FB3",
  fillOpacity: .6,
  strokeOpacity: .8,
  strokeWeight: 1,
  clickable: true,
}

export const zipPolygonOptions = {
  ...defaultPolygonOptions,
  fillColor: "#326B40",
  strokeColor: "#326B40",
  fillOpacity: .2,
  strokeOpacity: .8,
  strokeWeight: 2,
}

export const evkPolygonOptions = {
  fillColor: "#FF4444",
  strokeColor: "#FF5555",
  strokeOpacity: .8,
  strokeWeight: 2,
}

const MapPlaceholder = styled.div`
  height: 600px;
  width: 100%;
  background: #F2EFEA;
  position: relative;
`

const containerStyle = {
  width: '100%',
  height: '600px'
};

const MapBase = ({
  mapId,
  center,
  zoom,
  children,
  ...rest
}) => {
  const mapRef = useRef(null)
  const mapState = useRef({ center, initialCenter: center })

  const handleCenterChange = () => {
    const center = {
      lat: mapRef.current?.state.map.center.lat(),
      lng: mapRef.current?.state.map.center.lng()
    }
    mapState.current.center = center
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      mapIds={mapId ? [mapId] : undefined}
    >
      <MapPlaceholder>
        <GoogleMap
          mapContainerStyle={containerStyle}
          ref={mapRef}
          center={mapState.current?.center}
          onCenterChanged={handleCenterChange}
          zoom={zoom || 10}
          options={{
            mapId: mapId,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
              position: ControlPosition_LEFT_CENTER
            }
          }}
          {...rest}
        >
          {children}         
        </GoogleMap>
      </MapPlaceholder>
    </LoadScript>
  )
}

MapBase.Marker = MarkerImport

const Polygon = ({
  options = {},
  geometry,
  paths,
  ...rest
}) => {
  let p = paths

  const defaultOptions = {
    fillColor: "#386FB3",
    strokeColor: "#AAAAAA",
    fillOpacity: .8,
    strokeOpacity: .8,
    strokeWeight: 1,
    clickable: true,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  }
  
  if (geometry){
    const { coordinates, type } = geometry
    let isMulti = type === 'MultiPolygon'

    if (isMulti){
      return coordinates.map((subCoordinates, i) => (
        <PolygonImport
          key={i}
          options={{
          ...defaultOptions,
          ...options
          }}
          paths={geoJsonToPaths(subCoordinates)}
          {...rest}
        />
      ))
    }

    p = geoJsonToPaths(coordinates)
  }

  return (
    <PolygonImport
      options={{
      ...defaultOptions,
      ...options
      }}
      paths={p}
      {...rest}
    />
  )
}

MapBase.Polygon = Polygon

MapBase.SzkPolygon = ({
  options = {},
  ...rest
}) => (
  <Polygon
    options={{
      ...szkPolygonOptions,
      ...options
    }}
    {...rest}
  />
)

MapBase.ZipPolygon = ({
  options = {},
  ...rest
}) => (
  <Polygon
    options={{
      ...zipPolygonOptions,
      ...options
    }}
    {...rest}
  />
)

MapBase.EvkPolygon = ({
  options = {},
  unfilled,
  ...rest
}) => (
  <Polygon
    options={{
      ...evkPolygonOptions,
      ...options,
      fillOpacity: unfilled ? 0 : .3,
    }}
    {...rest}
  />
)

MapBase.Polyline = Polyline


export default MapBase
