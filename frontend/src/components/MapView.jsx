import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import AddTripForm from "./AddTripForm";
import "leaflet/dist/leaflet.css";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ trips, onAddTrip, onEditTrip }) => {
  const [showForm, setShowForm] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  // Wrap onAddTrip to also close modal
  const handleAddTripAndClose = (trip) => {
    onAddTrip(trip);
    setShowForm(false);
  };

  // Handle editing a trip
  const handleEditTripAndClose = (trip) => {
    onEditTrip(trip);
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleStartEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  return (
    <div style={{ position: "relative", height: "85vh", width: "100%", margin: "auto" }}>
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {trips.map((trip) => (
          <Marker key={trip.id} position={[trip.lat, trip.lng]}>
            <Popup>
              <div style={{ maxWidth: "220px" }}>
                <strong>{trip.title}</strong><br />
                {trip.dateRange?.start && (
                  <p>
                    <strong>Date:</strong> {trip.dateRange.start} → {trip.dateRange.end || "?"}
                  </p>
                )}
                {trip.description && <p>{trip.description}</p>}
                {trip.people?.length > 0 && (
                  <p>
                    <strong>With:</strong> {trip.people.join(", ")}
                  </p>
                )}
                {trip.photos?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                    {trip.photos.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Trip to ${trip.title} (${idx + 1})`}
                        onClick={() => setLightboxImg(url)}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleStartEdit(trip)}
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit Trip
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating + Button */}
      <button
        onClick={() => {
          setEditingTrip(null);
          setShowForm(true);
        }}
        style={{
          position: "absolute",
          bottom: "80px",
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

      {/* Modal to add/edit a trip */}
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
              onClick={() => {
                setShowForm(false);
                setEditingTrip(null);
              }}
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
            <AddTripForm
              onAddTrip={handleAddTripAndClose}
              onEditTrip={handleEditTripAndClose}
              editMode={!!editingTrip}
              tripToEdit={editingTrip}
              onClose={() => {
                setShowForm(false);
                setEditingTrip(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Lightbox for full photo preview */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            cursor: "zoom-out",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <img
            src={lightboxImg}
            alt=""
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transform: "scale(0.9)",
              animation: "zoomIn 0.25s ease-out forwards",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
