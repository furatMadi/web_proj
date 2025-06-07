import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Reverse geocoding helper
const fetchCityFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "json",
        lat: latitude,
        lon: longitude,
      },
    });
    const city =
      response.data.address.city ||
      response.data.address.town ||
      response.data.address.village ||
      response.data.address.hamlet ||
      "";
    return city;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "";
  }
};

// Marker that updates coordinates on map click
const LocationMarker = ({ position, onChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onChange({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

// Main component
const LocationPicker = ({ latitude, longitude, onChange }) => {
  const position = latitude && longitude ? [latitude, longitude] : [31.9, 35.2]; // Palestine center

  const handleMapClick = async ({ latitude, longitude }) => {
    const city = await fetchCityFromCoordinates(latitude, longitude);
    onChange({ latitude, longitude, city });
  };

  return (
    <MapContainer center={position} zoom={8} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker
        position={latitude && longitude ? { lat: latitude, lng: longitude } : null}
        onChange={handleMapClick}
      />
    </MapContainer>
  );
};

export default LocationPicker;
