import React, { useState, useEffect } from 'react';

const FilterBar = ({ trips, onFilterChange }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    people: [],
    keywords: '',
    selectedPeople: []
  });

  // Get unique people from all trips
  const allPeople = [...new Set(trips.flatMap(trip => trip.people || []))];

  const handleDateChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const handlePersonToggle = (person) => {
    setFilters(prev => ({
      ...prev,
      selectedPeople: prev.selectedPeople.includes(person)
        ? prev.selectedPeople.filter(p => p !== person)
        : [...prev.selectedPeople, person]
    }));
  };

  const handleKeywordChange = (e) => {
    setFilters(prev => ({
      ...prev,
      keywords: e.target.value
    }));
  };

  // Apply filters whenever they change
  useEffect(() => {
    const filteredTrips = trips.filter(trip => {
      // Date range filter
      if (filters.dateRange.start && new Date(trip.dateRange?.start) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(trip.dateRange?.end) > new Date(filters.dateRange.end)) {
        return false;
      }

      // People filter
      if (filters.selectedPeople.length > 0) {
        const tripPeople = trip.people || [];
        if (!filters.selectedPeople.some(person => tripPeople.includes(person))) {
          return false;
        }
      }

      // Keywords filter
      if (filters.keywords) {
        const searchText = filters.keywords.toLowerCase();
        const tripText = [
          trip.title,
          trip.description,
          ...(trip.people || [])
        ].join(' ').toLowerCase();
        
        if (!tripText.includes(searchText)) {
          return false;
        }
      }

      return true;
    });

    onFilterChange(filteredTrips);
  }, [filters, trips, onFilterChange]);

  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ marginBottom: "15px" }}>Filter Trips</h3>
      
      {/* Date Range Filter */}
      <div style={{ marginBottom: "15px" }}>
        <h4 style={{ marginBottom: "8px" }}>Date Range</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>Start Date:</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #ced4da"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>End Date:</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #ced4da"
              }}
            />
          </div>
        </div>
      </div>

      {/* People Filter */}
      {allPeople.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginBottom: "8px" }}>Filter by People</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {allPeople.map(person => (
              <button
                key={person}
                onClick={() => handlePersonToggle(person)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: filters.selectedPeople.includes(person) ? "#007bff" : "#e9ecef",
                  color: filters.selectedPeople.includes(person) ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {person}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Filter */}
      <div>
        <h4 style={{ marginBottom: "8px" }}>Search Keywords</h4>
        <input
          type="text"
          placeholder="Search in titles, descriptions, and people..."
          value={filters.keywords}
          onChange={handleKeywordChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ced4da"
          }}
        />
      </div>
    </div>
  );
};

export default FilterBar; 