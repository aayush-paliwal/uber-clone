import { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(center);
  const [isLoading, setIsLoading] = useState(true);

  const updatePosition = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({
      lat: latitude,
      lng: longitude,
    });
    setIsLoading(false); // Once position is updated, stop loading
  };

  const handleError = (error) => {
    console.error('Error getting geolocation: ', error.message);
    setIsLoading(false);
  };

  useEffect(() => {
    // Attempt to get the current position immediately
    navigator.geolocation.getCurrentPosition(updatePosition, handleError);

    // Watch position changes continuously
    const watchId = navigator.geolocation.watchPosition(updatePosition, handleError);

    // Cleanup function to clear the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        {!isLoading && <Marker position={currentPosition} />}
        {isLoading && <div>Loading...</div>}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;