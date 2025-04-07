import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../FoodLocater.css';

const FoodLocater = ({ user }) => {
  const [map, setMap] = useState(null);
  const [service, setService] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [currentSearchTerm] = useState("healthy food");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const placeDetailsCache = useRef(new Map());
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.onload = () => setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyArJ07huGvQJfifEh5tr2yr_toSbCkP6yo&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => setError("Failed to load Google Maps");
    document.head.appendChild(script);

    return () => {
      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    };
  }, []);

  // Initialize the map
  const initializeMap = useCallback((coords) => {
    try {
      const location = { lat: coords.latitude || coords.lat, lng: coords.longitude || coords.lng };
      setUserLocation(location);

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        gestureHandling: "cooperative",
        ariaLabel: "Interactive map showing restaurants"
      });

      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({ 
        suppressMarkers: true,
        preserveViewport: true
      });
      newDirectionsRenderer.setMap(newMap);

      const newService = new window.google.maps.places.PlacesService(newMap);
      const newInfowindow = new window.google.maps.InfoWindow();

      setMap(newMap);
      setService(newService);
      setInfowindow(newInfowindow);
      setDirectionsRenderer(newDirectionsRenderer);

      setupEventListeners();
      performNearbySearch(currentSearchTerm);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to initialize map");
      setIsLoading(false);
      console.error("Map initialization error:", err);
    }
  }, [currentSearchTerm]);

  // Error handlers
  const handleGeolocationError = useCallback((error) => {
    const errors = {
      1: "Permission denied. Using default location.",
      2: "Position unavailable. Using default location.",
      3: "Timeout exceeded. Using default location."
    };
    
    showError(errors[error.code] || "Geolocation error. Using default location.");
    initializeMap({ lat: 40.7128, lng: -74.0060 });
  }, [initializeMap]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded) return;

    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => initializeMap(position.coords),
        error => handleGeolocationError(error)
      );
    } else {
      setError("Geolocation is not supported by this browser. Showing default location.");
      initializeMap({ lat: 40.7128, lng: -74.0060 });
    }
  }, [isGoogleMapsLoaded, initializeMap, handleGeolocationError]);

  // Perform nearby search
  const performNearbySearch = useCallback((keyword) => {
    if (!service || !userLocation) return;

    const selectedPrice = document.getElementById("price-range")?.value;
    const minRating = document.getElementById("rating")?.value;

    const request = {
      location: userLocation,
      radius: 10000,
      type: "restaurant",
      keyword: keyword || currentSearchTerm,
      minRating: parseFloat(minRating) || 0,
      fields: ['name', 'geometry', 'formatted_address', 'rating', 'user_ratings_total']
    };

    if (selectedPrice) {
      request.minPrice = parseInt(selectedPrice);
      request.maxPrice = parseInt(selectedPrice);
    }

    clearMarkers();
    setIsLoading(true);

    service.nearbySearch(request, (results, status) => {
      setIsLoading(false);
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.slice(0, 20).forEach(createMarker);
      } else {
        handlePlacesError(status);
      }
    });
  }, [service, userLocation, currentSearchTerm]);

  // Create marker for each place
  const createMarker = useCallback((place) => {
    if (!place.geometry?.location || !map) return;

    const marker = new window.google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/restaurant.png",
        scaledSize: new window.google.maps.Size(32, 32)
      },
      title: place.name,
      ariaLabel: `Restaurant: ${place.name}`
    });

    setMarkers(prev => [...prev, marker]);
    setupMarkerInteraction(marker, place);
  }, [map]);

  // Setup marker click interaction
  const setupMarkerInteraction = useCallback((marker, place) => {
    marker.addListener("click", async () => {
      try {
        const details = await fetchPlaceDetails(place.place_id);
        const content = createInfoWindowContent(details);
        infowindow.setContent(content);
        infowindow.open(map, marker);
      } catch (error) {
        showError("Failed to load details");
      }
    });
  }, [infowindow, map]);

  // Fetch place details with caching
  const fetchPlaceDetails = useCallback((placeId) => {
    if (placeDetailsCache.current.has(placeId)) {
      return Promise.resolve(placeDetailsCache.current.get(placeId));
    }

    return new Promise((resolve, reject) => {
      service.getDetails({
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 
                'user_ratings_total', 'opening_hours', 'reviews']
      }, (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          placeDetailsCache.current.set(placeId, details);
          resolve(details);
        } else {
          reject(status);
        }
      });
    });
  }, [service]);

  // Create info window content
  const createInfoWindowContent = useCallback((details) => {
    const reviewsHTML = details.reviews?.slice(0, 3).map(review => `
      <div class="review">
        <div class="review-header">
          <span class="review-author">${review.author_name}</span>
          <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
        </div>
        <p class="review-text">${review.text}</p>
        <div class="review-time">${new Date(review.time * 1000).toLocaleDateString()}</div>
      </div>
    `).join('') || '<p class="no-reviews">No reviews available</p>';

    return `
      <div class="info-window" tabindex="-1" role="dialog" aria-label="${details.name} information">
        <h3>${details.name}</h3>
        <p>${details.formatted_address}</p>
        <div class="rating-stars" aria-label="Rating: ${details.rating} stars">
          ${'⭐'.repeat(Math.round(details.rating || 0))}
          <span>(${details.user_ratings_total || 0} reviews)</span>
        </div>
        <div class="reviews-container">
          <h4>Recent Reviews:</h4>
          ${reviewsHTML}
        </div>
        <button class="directions-btn" 
                onclick="window.getDirections(${details.geometry.location.lat()}, ${details.geometry.location.lng()})"
                aria-label="Get directions to ${details.name}">
          Get Directions
        </button>
      </div>
    `;
  }, []);

  // Get directions to a place
  const getDirections = useCallback((destLat, destLng) => {
    if (!userLocation || !directionsRenderer) {
      showError("Your location is not available.");
      return;
    }

    const mode = document.querySelector(".mode-btn.active")?.dataset.mode || "WALKING";

    const request = {
      origin: userLocation,
      destination: { lat: destLat, lng: destLng },
      travelMode: window.google.maps.TravelMode[mode]
    };

    if (mode === 'TRANSIT') {
      request.transitOptions = {
        modes: [
          window.google.maps.TransitMode.BUS,
          window.google.maps.TransitMode.TRAIN,
          window.google.maps.TransitMode.SUBWAY
        ],
        routingPreference: window.google.maps.TransitRoutePreference.FEWER_TRANSFERS
      };
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
        addBusStopMarkers(result);

        const leg = result.routes[0].legs[0];
        const steps = leg.steps;

        if (steps && steps.length > 0) {
          const midStep = steps[Math.floor(steps.length / 2)];
          const position = midStep.end_location;

          const blackBubble = new window.google.maps.InfoWindow({
            position: position,
            pixelOffset: new window.google.maps.Size(0, -10)
          });

          blackBubble.open(map);
        }
      } else {
        directionsRenderer.setDirections({ routes: [] });
        handleDirectionsError(status);
      }
    });
  }, [userLocation, directionsRenderer, map]);

  // Add bus stop markers for transit directions
  const addBusStopMarkers = useCallback((result) => {
    // Clear previous bus stops
    markers.filter(m => m.getTitle() === 'Bus Stop').forEach(m => m.setMap(null));
    
    const route = result.routes[0];
    if (!route) return;

    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        if (step.travel_mode === 'TRANSIT' && step.transit) {
          const stop = step.transit.departure_stop;
          const marker = new window.google.maps.Marker({
            position: stop.location,
            map: map,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
              scaledSize: new window.google.maps.Size(24, 24)
            },
            title: 'Bus Stop'
          });
          setMarkers(prev => [...prev, marker]);
        }
      });
    });
  }, [map, markers]);

  // Error handlers
  const handleDirectionsError = useCallback((status) => {
    const errors = {
      ZERO_RESULTS: "No route found. Try a different transportation mode.",
      NOT_FOUND: "Start or end location not found.",
      REQUEST_DENIED: "Directions request denied.",
      OVER_QUERY_LIMIT: "Directions service quota exceeded.",
      INVALID_REQUEST: "Invalid directions request.",
      UNKNOWN_ERROR: "Unknown error occurred. Please try again.",
      MAX_WAYPOINTS_EXCEEDED: "Too many waypoints in route.",
      TRANSIT_ROUTE_NOT_FOUND: "No bus route found. Try another transportation mode.",
      INVALID_TRANSIT_MODE: "Bus routes not available in this area",
      TRANSIT_ROUTE_NO_STATIONS_NEAR_ORIGIN: "No bus stops near starting point",
      TRANSIT_ROUTE_NO_STATIONS_NEAR_DEST: "No bus stops near destination"
    };

    showError(errors[status] || `Directions failed: ${status}`);
  }, []);

  const handlePlacesError = useCallback((status) => {
    const errors = {
      OVER_QUERY_LIMIT: "Search quota exceeded. Try again later.",
      ZERO_RESULTS: "No results found. Try a different search term.",
      ERROR: "Search service unavailable. Please try again.",
      INVALID_REQUEST: "Invalid search request.",
      NOT_FOUND: "Search location not found."
    };

    showError(errors[status] || `Search failed: ${status}`);
  }, []);

  // UI helpers
  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }, [markers]);

  const debouncedSearch = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      const input = document.getElementById("search-input")?.value.trim();
      performNearbySearch(input);
    }, 300);
  }, [performNearbySearch]);

  // Setup event listeners
  const setupEventListeners = useCallback(() => {
    const modeButtons = document.querySelectorAll(".mode-btn");
    if (modeButtons) {
      modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", debouncedSearch);
    }

    const priceRange = document.getElementById("price-range");
    if (priceRange) {
      priceRange.addEventListener("change", () => performNearbySearch());
    }

    const rating = document.getElementById("rating");
    if (rating) {
      rating.addEventListener("change", () => performNearbySearch());
    }
  }, [debouncedSearch, performNearbySearch]);

  // Expose getDirections to window for HTML button click
  useEffect(() => {
    window.getDirections = getDirections;
    window.searchNearby = () => {
      const input = document.getElementById("search-input")?.value.trim();
      performNearbySearch(input);
    };

    return () => {
      delete window.getDirections;
      delete window.searchNearby;
    };
  }, [getDirections, performNearbySearch]);

  return (
    <div className="food-locater-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}

      <div id="controls">
        <div id="search-container">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search food places..." 
            aria-label="Search food places"
          />

          <div id="filters">
            <select id="price-range" aria-label="Price range filter">
              <option value="">All Prices</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </select>

            <select id="rating" aria-label="Minimum rating filter">
              <option value="0">All Ratings</option>
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
            </select>

            <label className="filter-checkbox">
              <input type="checkbox" id="open-now" aria-label="Show open now" />
              Open Now
            </label>
          </div>

          <button onClick={() => {
            const input = document.getElementById("search-input")?.value.trim();
            performNearbySearch(input);
          }} aria-label="Search">
            <i className="fas fa-search"></i> Search
          </button>
        </div>

        <div id="transport-mode">
          <button className="mode-btn active" data-mode="WALKING" aria-label="Walking directions">
            <div>Walk</div>
            <i className="fas fa-walking"></i>
          </button>
          <button className="mode-btn" data-mode="DRIVING" aria-label="Driving directions">
            <div>Car</div>
            <i className="fas fa-car"></i>
          </button>
          <button className="mode-btn" data-mode="BICYCLING" aria-label="Bicycling directions">
            <div>Bicycle</div>
            <i className="fas fa-bicycle"></i>
          </button>
          <button className="mode-btn" data-mode="TRANSIT" aria-label="Public transit directions">
            <div>Transit</div>
            <i className="fas fa-train"></i>
          </button>
        </div>
      </div>

      <div 
        ref={mapRef} 
        id="map" 
        style={{ height: 'calc(100vh - 120px)', width: '100%' }} 
        role="region" 
        aria-label="Interactive food map"
      />
    </div>
  );
};

export default FoodLocater;