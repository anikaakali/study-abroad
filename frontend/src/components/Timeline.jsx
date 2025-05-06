import React from "react";

const Timeline = ({ trips }) => {
  // Sort trips by start date (most recent first)
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.dateRange?.start || 0);
    const dateB = new Date(b.dateRange?.start || 0);
    return dateB - dateA;
  });

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
        </div>
      ))}
    </div>
  );
};

export default Timeline;
