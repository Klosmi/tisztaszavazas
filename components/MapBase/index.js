import React, { useRef, useEffect } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker as MarkerImport,
  Polygon as PolygonImport
} from '@react-google-maps/api'
import styled from 'styled-components';

export const ControlPosition_LEFT_CENTER = 4

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
}) => {
  const mapRef = useRef(null)
  const mapState = useRef({ center, initialCenter: center })

  useEffect(() => {
    if (mapState.current.initialCenter !== center){
      mapState.current.initialCenter = center
      mapState.current.center = center
    }
  }, [center])

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
          center={mapState.current.initialCenter !== center ? center : mapState.current?.center}
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
        >
          {children}         
        </GoogleMap>
      </MapPlaceholder>
    </LoadScript>
  )
}

MapBase.Marker = MarkerImport

MapBase.SzkPolygon = ({
  options = {},
  ...rest
}) => (
  <PolygonImport
    options={{
    fillColor: "#386FB3",
    strokeColor: "#386FB3",
    fillOpacity: .3,
    strokeOpacity: .8,
    strokeWeight: 1,
    clickable: true,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
    ...options
    }}
    {...rest}
  />
)

MapBase.ZipPolygon = ({
  options = {},
  ...rest
}) => (
  <PolygonImport
    options={{
      fillColor: "#326B40",
      strokeColor: "#326B40",
      fillOpacity: .2,
      strokeOpacity: .8,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: false,
      zIndex: 1,
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
  <PolygonImport
    options={{
      fillColor: "#FF4444",
      strokeColor: "#FF5555",
      fillOpacity: unfilled ? 0 : .3,
      strokeOpacity: .8,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: false,
      zIndex: 1,
    ...options
    }}
    {...rest}
  />
)


export default MapBase
