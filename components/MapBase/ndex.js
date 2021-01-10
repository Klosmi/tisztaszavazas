import React, { Component } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker as MarkerImport,
  Polygon as PolygonImport
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

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

class MapBase extends Component {
  static Marker = MarkerImport
  static Polygon = PolygonImport
  static SzkPolygon = ({
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

  static ZipPolygon = ({
    options = {},
    ...rest
  }) => (
    <PolygonImport
      options={{
        fillColor: "#386FB3",
        strokeColor: "#FF3333",
        fillOpacity: 0,
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

  render() {
    return (
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={this.props.center}
          zoom={15}
        >
          {this.props.children}         
        </GoogleMap>
      </LoadScript>
    )
  }
}

export default MapBase
