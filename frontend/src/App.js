import React, { useState } from "react";
import MapView from "./components/MapView";
import Timeline from "./components/Timeline";

function App() {
  const [view, setView] = useState("map");
  const [trips, setTrips] = useState([]);

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
      </div>

      {/* Conditional view rendering */}
      {view === "map" ? (
        <MapView 
          trips={trips} 
          onAddTrip={handleAddTrip} 
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      ) : (
        <Timeline 
          trips={trips} 
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      )}
    </div>
  );
}

export default App;
