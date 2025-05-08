import React, { useState } from "react";
import AddTripForm from "./AddTripForm";

const Timeline = ({ trips, onEditTrip, onDeleteTrip }) => {
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Sort trips by start date (most recent first)
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.dateRange?.start || 0);
    const dateB = new Date(b.dateRange?.start || 0);
    return dateB - dateA;
  });

  const handleEditTripAndClose = (trip) => {
    onEditTrip(trip);
    setEditingTrip(null);
  };

  const handleDeleteConfirm = () => {
    if (tripToDelete) {
      onDeleteTrip(tripToDelete.id);
      setTripToDelete(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Your Trips</h2>

      {sortedTrips.map((trip) => (
        <div
          key={trip.id}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>{trip.title}</h3>

          <p>
            <strong>Date:</strong>{" "}
            {trip.dateRange?.start
              ? `${trip.dateRange.start} → ${trip.dateRange.end || "?"}`
              : "Not specified"}
          </p>

          {trip.people?.length > 0 && (
            <p>
              <strong>With:</strong> {trip.people.join(", ")}
            </p>
          )}

          {trip.description && <p>{trip.description}</p>}

          {trip.photos?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {trip.photos.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Trip to ${trip.title} (${idx + 1})`}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => setEditingTrip(trip)}
              style={{
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
            <button
              onClick={() => setTripToDelete(trip)}
              style={{
                padding: "4px 8px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete Trip
            </button>
          </div>
        </div>
      ))}

      {/* Modal for editing */}
      {editingTrip && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
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
              onClick={() => setEditingTrip(null)}
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
              onEditTrip={handleEditTripAndClose}
              editMode={true}
              tripToEdit={editingTrip}
              onClose={() => setEditingTrip(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3>Delete Trip</h3>
            <p>Are you sure you want to delete your trip to {tripToDelete.title}?</p>
            <p>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={() => setTripToDelete(null)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
