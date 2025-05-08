import React from 'react';

const StatsDashboard = ({ trips }) => {
  // Calculate total number of trips
  const totalTrips = trips.length;

  // Calculate unique countries visited
  const countries = [...new Set(trips.map(trip => {
    const parts = trip.title.split(',');
    return parts[parts.length - 1]?.trim() || 'Unknown';
  }))];
  const uniqueCountries = countries.length;

  // Calculate total days traveled
  const totalDays = trips.reduce((acc, trip) => {
    if (trip.dateRange?.start && trip.dateRange?.end) {
      const start = new Date(trip.dateRange.start);
      const end = new Date(trip.dateRange.end);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return acc + diffDays;
    }
    return acc;
  }, 0);

  // Calculate most frequent travel companions
  const companions = trips.reduce((acc, trip) => {
    (trip.people || []).forEach(person => {
      acc[person] = (acc[person] || 0) + 1;
    });
    return acc;
  }, {});
  const topCompanions = Object.entries(companions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Calculate most visited locations
  const locations = trips.reduce((acc, trip) => {
    acc[trip.title] = (acc[trip.title] || 0) + 1;
    return acc;
  }, {});
  const topLocations = Object.entries(locations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ 
        textAlign: "center", 
        color: "#2c3e50",
        marginBottom: "30px"
      }}>
        Travel Statistics
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* Total Trips Card */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2.5rem", color: "#007bff", marginBottom: "10px" }}>
            {totalTrips}
          </div>
          <div style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Total Trips
          </div>
        </div>

        {/* Countries Visited Card */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2.5rem", color: "#28a745", marginBottom: "10px" }}>
            {uniqueCountries}
          </div>
          <div style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Countries Visited
          </div>
        </div>

        {/* Total Days Card */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2.5rem", color: "#ffc107", marginBottom: "10px" }}>
            {totalDays}
          </div>
          <div style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Total Days Traveled
          </div>
        </div>
      </div>

      {/* Top Travel Companions */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>
          Top Travel Companions
        </h3>
        {topCompanions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topCompanions.map(([person, count], index) => (
              <div key={person} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ 
                    backgroundColor: "#007bff",
                    color: "white",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem"
                  }}>
                    {index + 1}
                  </span>
                  {person}
                </div>
                <div style={{ color: "#6c757d" }}>
                  {count} {count === 1 ? 'trip' : 'trips'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#6c757d", fontStyle: "italic" }}>
            No travel companions recorded yet
          </div>
        )}
      </div>

      {/* Most Visited Locations */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>
          Most Visited Locations
        </h3>
        {topLocations.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topLocations.map(([location, count], index) => (
              <div key={location} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ 
                    backgroundColor: "#28a745",
                    color: "white",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem"
                  }}>
                    {index + 1}
                  </span>
                  {location}
                </div>
                <div style={{ color: "#6c757d" }}>
                  {count} {count === 1 ? 'visit' : 'visits'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#6c757d", fontStyle: "italic" }}>
            No locations recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard; 