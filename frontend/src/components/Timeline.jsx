import React, { useState } from "react";
import AddTripForm from "./AddTripForm";

const Timeline = ({ trips, onEditTrip, onDeleteTrip }) => {
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Your Trips</h2>

      {sortedTrips.map((trip) => (
        <div
          key={trip.id}
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #e9ecef",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          }}
        >
          <h3 style={{ 
            margin: "0 0 15px 0",
            color: "#2c3e50",
            fontSize: "1.5rem"
          }}>
            {trip.title}
          </h3>

          <p style={{ 
            margin: "0 0 15px 0",
            color: "#6c757d",
            fontSize: "0.9rem"
          }}>
            <strong>Date:</strong>{" "}
            {trip.dateRange?.start
              ? `${trip.dateRange.start} → ${trip.dateRange.end || "?"}`
              : "Not specified"}
          </p>

          {trip.people?.length > 0 && (
            <p style={{ 
              margin: "0 0 15px 0",
              color: "#495057"
            }}>
              <strong>With:</strong>{" "}
              {trip.people.map((person, index) => (
                <span key={person}>
                  {index > 0 && ", "}
                  <span style={{
                    backgroundColor: "#e9ecef",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.9rem"
                  }}>
                    {person}
                  </span>
                </span>
              ))}
            </p>
          )}

          {trip.description && (
            <p style={{ 
              margin: "0 0 15px 0",
              color: "#495057",
              lineHeight: "1.5"
            }}>
              {trip.description}
            </p>
          )}

          {trip.photos?.length > 0 && (
            <div style={{ 
              marginTop: "20px",
              marginBottom: "20px"
            }}>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px"
              }}>
                {trip.photos.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      aspectRatio: "1",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                    onClick={() => setSelectedPhoto({ url, trip: trip.title })}
                  >
                    <img
                      src={url}
                      alt={`Trip to ${trip.title} (${idx + 1})`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "8px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      color: "white",
                      fontSize: "0.8rem",
                      opacity: 0,
                      transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                    >
                      Click to view
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ 
            display: "flex", 
            gap: "10px", 
            marginTop: "20px",
            borderTop: "1px solid #e9ecef",
            paddingTop: "15px"
          }}>
            <button
              onClick={() => setEditingTrip(trip)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
            >
              <span role="img" aria-label="edit">✏️</span>
              Edit Trip
            </button>
            <button
              onClick={() => setTripToDelete(trip)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
            >
              <span role="img" aria-label="delete">🗑️</span>
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

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            cursor: "zoom-out",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <div style={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh"
          }}>
            <img
              src={selectedPhoto.url}
              alt={`Trip to ${selectedPhoto.trip}`}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                animation: "zoomIn 0.2s ease-out"
              }}
            />
            <div style={{
              position: "absolute",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              textAlign: "center",
              fontSize: "0.9rem",
              opacity: 0.8
            }}>
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
