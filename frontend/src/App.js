import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import Timeline from "./components/Timeline";
import FilterBar from "./components/FilterBar";
import StatsDashboard from "./components/StatsDashboard";

function App() {
  const [view, setView] = useState("map");
  const [trips, setTrips] = useState(() => {
    // Initialize trips from localStorage if available
    const savedTrips = localStorage.getItem('trips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });
  const [filteredTrips, setFilteredTrips] = useState(trips);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
    setFilteredTrips(trips); // Reset filtered trips when trips change
  }, [trips]);

  // Passed to MapView to handle adding new trips
  const handleAddTrip = (trip) => {
    setTrips((prev) => [...prev, trip]);
  };

  // Handle editing existing trips
  const handleEditTrip = (editedTrip) => {
    setTrips((prev) => prev.map((trip) => 
      trip.id === editedTrip.id ? editedTrip : trip
    ));
  };

  // Handle deleting trips
  const handleDeleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
  };

  // Handle filter changes
  const handleFilterChange = (filtered) => {
    setFilteredTrips(filtered);
  };

  return (
    <div>
      {/* Header */}
      <h1 style={{ textAlign: "center" }}>Study Abroad Tracker</h1>

      {/* Toggle buttons */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <button
          onClick={() => setView("map")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: view === "map" ? "#007bff" : "#e0e0e0",
            color: view === "map" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Map View
        </button>

        <button
          onClick={() => setView("timeline")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: view === "timeline" ? "#007bff" : "#e0e0e0",
            color: view === "timeline" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Timeline View
        </button>

        <button
          onClick={() => setView("stats")}
          style={{
            padding: "8px 16px",
            backgroundColor: view === "stats" ? "#007bff" : "#e0e0e0",
            color: view === "stats" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Stats View
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ maxWidth: "800px", margin: "0 auto 20px" }}>
        <FilterBar trips={trips} onFilterChange={handleFilterChange} />
      </div>

      {/* Conditional view rendering */}
      {view === "map" ? (
        <MapView 
          trips={filteredTrips} 
          onAddTrip={handleAddTrip} 
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      ) : view === "timeline" ? (
        <Timeline 
          trips={filteredTrips} 
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      ) : (
        <StatsDashboard trips={filteredTrips} />
      )}
    </div>
  );
}

export default App;
