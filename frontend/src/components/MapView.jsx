import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import AddTripForm from "./AddTripForm";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddTrip = (trip) => {
    setTrips([...trips, trip]);
    setShowForm(false); // Close modal on submit
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {trips.map((trip) => (
          <Marker key={trip.id} position={[trip.lat, trip.lng]}>
            <Popup>
              <strong>{trip.title}</strong>
              <br />
              {trip.description}
              {trip.people?.length > 0 && (
                <div>
                  <strong>With:</strong> {trip.people.join(", ")}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating + Button */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "2rem",
          border: "none",
          cursor: "pointer",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        +
      </button>

      {/* Modal */}
      {showForm && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
            <AddTripForm onAddTrip={handleAddTrip} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
