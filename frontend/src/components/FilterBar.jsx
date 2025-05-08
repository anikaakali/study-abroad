import React, { useState, useEffect } from 'react';

const FilterBar = ({ trips, onFilterChange }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    people: [],
    keywords: '',
    selectedPeople: [],
    peopleFilterMode: 'or' // 'or' or 'and'
  });
  const [isExpanded, setIsExpanded] = useState(false);

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

  const togglePeopleFilterMode = () => {
    setFilters(prev => ({
      ...prev,
      peopleFilterMode: prev.peopleFilterMode === 'or' ? 'and' : 'or'
    }));
  };

  const handleKeywordChange = (e) => {
    setFilters(prev => ({
      ...prev,
      keywords: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      people: [],
      keywords: '',
      selectedPeople: [],
      peopleFilterMode: 'or'
    });
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
        if (filters.peopleFilterMode === 'and') {
          // All selected people must be in the trip
          if (!filters.selectedPeople.every(person => tripPeople.includes(person))) {
            return false;
          }
        } else {
          // At least one selected person must be in the trip
          if (!filters.selectedPeople.some(person => tripPeople.includes(person))) {
            return false;
          }
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

  const hasActiveFilters = filters.dateRange.start || filters.dateRange.end || 
    filters.selectedPeople.length > 0 || filters.keywords;

  const activeFilterCount = [
    filters.dateRange.start && 1,
    filters.dateRange.end && 1,
    filters.selectedPeople.length,
    filters.keywords && 1
  ].filter(Boolean).length;

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e9ecef",
      overflow: "hidden",
      transition: "all 0.3s ease-in-out"
    }}>
      {/* Header - Always visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: "15px 20px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: hasActiveFilters ? "#e7f5ff" : "white",
          transition: "background-color 0.2s"
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px"
        }}>
          <span role="img" aria-label="filter" style={{ fontSize: "1.2rem" }}>🔍</span>
          <h3 style={{ 
            margin: 0,
            fontSize: "1.1rem",
            color: "#2c3e50"
          }}>
            Filter Trips
            {activeFilterCount > 0 && (
              <span style={{
                marginLeft: "8px",
                backgroundColor: "#007bff",
                color: "white",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.8rem"
              }}>
                {activeFilterCount}
              </span>
            )}
          </h3>
        </div>
        <span 
          role="img" 
          aria-label={isExpanded ? "collapse" : "expand"}
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease-in-out",
            fontSize: "1.2rem"
          }}
        >
          ⬆️
        </span>
      </div>

      {/* Filter Content - Collapsible */}
      <div style={{
        maxHeight: isExpanded ? "1000px" : "0",
        opacity: isExpanded ? 1 : 0,
        transition: "all 0.3s ease-in-out",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px" }}>
          {/* Date Range Filter */}
          <div style={{ 
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <h4 style={{ 
              marginBottom: "12px",
              fontSize: "1rem",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span role="img" aria-label="calendar">📅</span>
              Date Range
            </h4>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px",
                  fontSize: "0.875rem",
                  color: "#6c757d"
                }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.875rem",
                    color: "#495057",
                    backgroundColor: "white",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px",
                  fontSize: "0.875rem",
                  color: "#6c757d"
                }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.875rem",
                    color: "#495057",
                    backgroundColor: "white",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* People Filter */}
          {allPeople.length > 0 && (
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <h4 style={{ 
                  fontSize: "1rem",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  margin: 0
                }}>
                  <span role="img" aria-label="people">👥</span>
                  Filter by People
                </h4>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#e9ecef",
                  padding: "4px",
                  borderRadius: "6px"
                }}>
                  <button
                    onClick={togglePeopleFilterMode}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: filters.peopleFilterMode === 'or' ? "#007bff" : "transparent",
                      color: filters.peopleFilterMode === 'or' ? "white" : "#495057",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      transition: "all 0.2s"
                    }}
                  >
                    OR
                  </button>
                  <button
                    onClick={togglePeopleFilterMode}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: filters.peopleFilterMode === 'and' ? "#007bff" : "transparent",
                      color: filters.peopleFilterMode === 'and' ? "white" : "#495057",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      transition: "all 0.2s"
                    }}
                  >
                    AND
                  </button>
                </div>
              </div>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "8px",
                marginTop: "8px"
              }}>
                {allPeople.map(person => (
                  <button
                    key={person}
                    onClick={() => handlePersonToggle(person)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.selectedPeople.includes(person) ? "#007bff" : "white",
                      color: filters.selectedPeople.includes(person) ? "white" : "#495057",
                      border: "1px solid",
                      borderColor: filters.selectedPeople.includes(person) ? "#007bff" : "#ced4da",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseOver={(e) => {
                      if (!filters.selectedPeople.includes(person)) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!filters.selectedPeople.includes(person)) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {filters.selectedPeople.includes(person) && (
                      <span role="img" aria-label="check">✓</span>
                    )}
                    {person}
                  </button>
                ))}
              </div>
              <div style={{
                marginTop: "8px",
                fontSize: "0.75rem",
                color: "#6c757d",
                fontStyle: "italic"
              }}>
                {filters.peopleFilterMode === 'or' 
                  ? "Show trips with any of the selected people"
                  : "Show trips with all of the selected people"}
              </div>
            </div>
          )}

          {/* Keywords Filter */}
          <div style={{ 
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <h4 style={{ 
              marginBottom: "12px",
              fontSize: "1rem",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span role="img" aria-label="search">🔎</span>
              Search Keywords
            </h4>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search in titles, descriptions, and people..."
                value={filters.keywords}
                onChange={handleKeywordChange}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  borderRadius: "6px",
                  border: "1px solid #ced4da",
                  fontSize: "0.875rem",
                  color: "#495057",
                  backgroundColor: "white",
                  boxSizing: "border-box"
                }}
              />
              <span 
                role="img" 
                aria-label="search"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "0.875rem"
                }}
              >
                🔍
              </span>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div style={{ 
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              >
                <span role="img" aria-label="clear">✕</span>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 