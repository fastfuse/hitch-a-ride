import React from "react";
import {GoogleMap, withGoogleMap} from "react-google-maps";

const GoogleMapComponent = ({children}) => (
    <GoogleMap
        defaultZoom={10}
        defaultCenter={{lat: 49.83826, lng: 24.02324}}
    >
        {children}
    </GoogleMap>
);

export default withGoogleMap(GoogleMapComponent);
