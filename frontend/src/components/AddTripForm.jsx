import React, { useState } from "react";
import axios from "axios";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWFrYWxpIiwiYSI6ImNtYWE4cnN4MDFyb3IybHNiaDA5Mml6a2IifQ.LOC5NMuQJbFeEF9QNFZu7w'; // my token

const AddTripForm = ({ onAddTrip }) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [person, setPerson] = useState("");
  const [people, setPeople] = useState([]);

  const [photos, setPhotos] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocation(query);
    setSelectedPlace(null);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlace) return;

    const [lng, lat] = selectedPlace.center;

    onAddTrip({
      id: Date.now(),
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
    });

    // Reset form
    setLocation("");
    setDescription("");
    setSelectedPlace(null);
    setPerson("");
    setPeople([]);
    setPhotos([]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px" }}>
      <h2>Add a Trip</h2>

      <input
        placeholder="Search for a city"
        value={location}
        onChange={handleLocationChange}
      /><br />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {suggestions.map((sug) => (
          <li key={sug.id}>
            <button type="button" onClick={() => handleSelectLocation(sug)}>
              {sug.place_name}
            </button>
          </li>
        ))}
      </ul>

      <textarea
        placeholder="What did you do?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br />

      {/* Date Range */}
      <div style={{ marginBottom: "10px" }}>
        <label>Start Date: </label><br />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /><br />
        <label>End Date: </label><br />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* People */}
      <div>
        <input
          placeholder="Who were you with?"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        />
        <button type="button" onClick={handleAddPerson}>Add Person</button>
      </div>

      <ul>
        {people.map((p) => (
          <li key={p}>
            {p} <button type="button" onClick={() => handleRemovePerson(p)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Photos */}
      <div style={{ marginTop: "10px" }}>
        <label>Upload Photos:</label><br />
        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
        {photos.map((src, idx) => (
          <img key={idx} src={src} alt={`Trip to ${selectedPlace?.place_name || "unknown"} (${idx + 1})`}
          width={80} height={80} />
        ))}
      </div>

      <br />
      <button type="submit" disabled={!selectedPlace}>Add Trip</button>
    </form>
  );
};

export default AddTripForm;
