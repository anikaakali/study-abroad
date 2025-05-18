# Study Abroad Tracker

A personal web application to document your study abroad experiences -- inspired by my time abroad in Prague (Jan 2025 - May 2025)! 

## 🌟 Features

### 📍 Interactive Map View
- Visualize all your study abroad locations on an interactive world map
- Click on markers to view trip details
- Add new trips directly from the map view
- View photos and memories associated with each location
- Edit or delete trips as needed

### 📅 Timeline View
- Chronological view of all your study abroad experiences
- Beautiful card-based layout for each trip
- Quick access to trip details, photos, and companions
- Easy editing and management of trip information
- Responsive design that works on all devices

### 📊 Statistics Dashboard
- Track your travel statistics and milestones
- View total number of trips and countries visited
- Calculate total days spent abroad
- Discover your most frequent travel companions
- See your most visited locations
- Filter statistics based on date ranges or companions

### 🔍 Smart Filtering
- Filter trips by date range
- Search by location, description, or companions
- Filter by travel companions (AND/OR logic)
- Real-time filtering across all views
- Clear filters with one click

### 📸 Photo Management
- Upload multiple photos for each trip
- View photos in a beautiful grid layout
- Click to view full-size images
- Delete photos individually
- Photo preview modal for detailed viewing

### 💾 Data Persistence
- All your data is automatically saved locally
- No account required - your data stays on your device
- Easy to backup and restore

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/study-abroad.git
cd study-abroad
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 How to Use

### Adding a New Trip
1. Click the "+" button in the Map View
2. Enter the location (with autocomplete)
3. Add trip details:
   - Description of your experience
   - Start and end dates
   - Travel companions
   - Photos
4. Click "Add Trip" to save

### Managing Trips
- **Edit**: Click the "Edit Trip" button on any trip card or map marker
- **Delete**: Use the "Delete Trip" button (with confirmation)
- **View Details**: Click on map markers or timeline cards
- **Filter**: Use the filter bar to find specific trips

### Using the Statistics Dashboard
- Switch to "Stats View" to see your travel statistics
- View your most visited locations and frequent companions
- Track your total travel days and countries visited
- Use filters to analyze specific time periods or companions

## 🛠️ Technical Details

### Built With
- React.js - Frontend framework
- Leaflet - Interactive maps
- Mapbox - Location search and geocoding
- Local Storage - Data persistence
- Modern CSS - Styling and animations

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── AddTripForm.jsx    # Form for adding/editing trips
│   │   ├── FilterBar.jsx      # Trip filtering component
│   │   ├── MapView.jsx        # Interactive map view
│   │   ├── StatsDashboard.jsx # Statistics and analytics
│   │   └── Timeline.jsx       # Chronological trip view
│   ├── App.js                 # Main application component
│   └── index.js              # Application entry point
```


## 🙏 Acknowledgments

- Mapbox for providing the location search API
- OpenStreetMap for the map tiles
- The React community for the amazing tools and libraries

---
Made with ❤️ to help students document and cherish their study abroad experiences.
