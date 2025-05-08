import React, { useState, useEffect } from "react";
import axios from "axios";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWFrYWxpIiwiYSI6ImNtYWE4cnN4MDFyb3IybHNiaDA5Mml6a2IifQ.LOC5NMuQJbFeEF9QNFZu7w'; // my token

const AddTripForm = ({ onAddTrip, onEditTrip, editMode, tripToEdit, onClose }) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [person, setPerson] = useState("");
  const [people, setPeople] = useState([]);

  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Initialize form with trip data when editing
  useEffect(() => {
    if (editMode && tripToEdit) {
      setDescription(tripToEdit.description || "");
      setLocation(tripToEdit.title || "");
      setPeople(tripToEdit.people || []);
      setPhotos(tripToEdit.photos || []);
      setStartDate(tripToEdit.dateRange?.start || "");
      setEndDate(tripToEdit.dateRange?.end || "");
      setSelectedPlace({
        place_name: tripToEdit.title,
        center: [tripToEdit.lng, tripToEdit.lat]
      });
    }
  }, [editMode, tripToEdit]);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocation(query);
    setSelectedPlace(null);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            limit: 5,
            types: "place",
          },
        }
      );

      setSuggestions(res.data.features);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (place) => {
    setLocation(place.place_name);
    setSelectedPlace(place);
    setSuggestions([]);
  };

  const handleAddPerson = () => {
    if (person.trim()) {
      setPeople([...people, person.trim()]);
      setPerson("");
    }
  };

  const handleRemovePerson = (name) => {
    setPeople(people.filter((p) => p !== name));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotos([...photos, ...urls]);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index]); // Clean up the object URL
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    if (selectedPhoto === index) {
      setSelectedPhoto(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlace) {
      alert("Please select a location from the suggestions");
      return;
    }

    const [lng, lat] = selectedPlace.center;

    const tripData = {
      id: editMode ? tripToEdit.id : Date.now(),
      title: selectedPlace.place_name,
      description,
      people,
      photos,
      dateRange: {
        start: startDate,
        end: endDate
      },
      lat,
      lng,
    };

    if (editMode) {
      onEditTrip(tripData);
    } else {
      onAddTrip(tripData);
    }

    // Reset form
    setLocation("");
    setDescription("");
    setSelectedPlace(null);
    setPerson("");
    setPeople([]);
    setPhotos([]);
    setStartDate("");
    setEndDate("");
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px" }}>
      <h2>{editMode ? "Edit Trip" : "Add a Trip"}</h2>

      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          placeholder="Search for a city"
          value={location}
          onChange={handleLocationChange}
          style={{ width: "100%", padding: "8px" }}
        />
        {isSearching && (
          <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
            Searching...
          </div>
        )}
        {suggestions.length > 0 && (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            position: 'absolute', 
            width: '100%', 
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {suggestions.map((sug) => (
              <li key={sug.id}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(sug)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  {sug.place_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <textarea
        placeholder="What did you do?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px", minHeight: "100px" }}
      />

      {/* Date Range */}
      <div style={{ marginBottom: "15px" }}>
        <label>Start Date: </label><br />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        /><br />
        <label>End Date: </label><br />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* People */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            placeholder="Who were you with?"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button 
            type="button" 
            onClick={handleAddPerson}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add Person
          </button>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: "15px" }}>
        {people.map((p) => (
          <li key={p} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            {p}
            <button
              type="button"
              onClick={() => handleRemovePerson(p)}
              style={{
                padding: "2px 8px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Photos */}
      <div style={{ marginBottom: "15px" }}>
        <label>Upload Photos:</label><br />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
            gap: "10px",
            marginBottom: "10px"
          }}>
            {photos.map((src, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={src}
                  alt={`Trip to ${selectedPlace?.place_name || "unknown"} (${idx + 1})`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedPhoto(idx)}
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(idx)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(220, 53, 69, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto !== null && (
        <div
          onClick={() => setSelectedPhoto(null)}
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
            cursor: "zoom-out"
          }}
        >
          <img
            src={photos[selectedPhoto]}
            alt=""
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
            }}
          />
        </div>
      )}

      <br />
      <button
        type="submit"
        disabled={!selectedPlace}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: selectedPlace ? "#007bff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: selectedPlace ? "pointer" : "not-allowed"
        }}
      >
        {editMode ? "Save Changes" : "Add Trip"}
      </button>
    </form>
  );
};

export default AddTripForm;
