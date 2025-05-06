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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlace) return;

    const [lng, lat] = selectedPlace.center;

    onAddTrip({
      id: Date.now(),
      title: selectedPlace.place_name,
      description,
      people,
      lat,
      lng,
    });

    // Reset form
    setLocation("");
    setDescription("");
    setSelectedPlace(null);
    setPerson("");
    setPeople([]);
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

      <button type="submit" disabled={!selectedPlace}>Add Trip</button>
    </form>
  );
};

export default AddTripForm;
