import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
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

class SzkMap extends Component {
  render() {
    return (
      <main>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={this.props.center}
          zoom={15}
        >
          <Marker
            position={this.props.center}
          />
          <Polygon
            paths={this.props.polygonPath}
            options={options}
          />          
        </GoogleMap>
      </LoadScript>
      </main>
    )
  }
}

export default SzkMap
