import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './ItineraryMap.css';
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createItinerary } from "../../store/itineraries";

const ItineraryMap = ({ mapOptions = {} }) => {

    const dispatch = useDispatch();
    const [map, setMap] = useState(null);
    const [location, setLocation] = useState('Manhattan');
    const [type, setType] = useState('bar');
    const [number, setNumber] = useState(3);
    const [radius, setRadius] = useState(500); // meters
    const [lat, setLat] = useState(40.736164);
    const [lng, setLng] = useState(-73.993921)
    // const [geoLat, setGeoLat] = useState(0);
    // const [geoLng, setGeoLng] = useState(0);

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function (position) {
    //         const latitude = position.coords.latitude;
    //         const longitude = position.coords.longitude;

    //         // Use latitude and longitude values in your application
    //         console.log("Latitude: " + latitude);
    //         console.log("Longitude: " + longitude);
    //         setGeoLat(latitude);
    //         setGeoLng(longitude);
    //     });
    // } else {
    //     // Geolocation is not supported by the browser
    //     console.log("Geolocation is not supported");
    // }

    const mapRef = useRef(null);
    const markers = useRef([]);
    const history = useHistory();

    // const [activities, setActivities] = useState([]); // array to store activities
    const [selectedActivities, setSelectedActivities] = useState([]); // selected activity for itinerary
    // const [markers, setMarkers] = useState([]); // array to store markers


    const [generatedActivities, setGeneratedActivities] = useState([]);

    // Creates the map
    useEffect(() => {
        // if (geoLat !== 0 && geoLng !== 0 && !map)
        if (!map) {
            setMap(new window.google.maps.Map(mapRef.current, {
                center: {
                    lat: lat,
                    lng: lng
                },
                zoom: 15,
                clickableIcons: false,
                ...mapOptions,
            }));
        }
    }, [mapRef, map, mapOptions]);

    const handleLocation = (e) => {
        setLocation(e.target.value);
    }

    const handleType = (e) => {
        setType(e.target.value);
    }
    const handleNumber = (e) => {
        setNumber(e.target.value);
    }
    const handleRadius = (e) => {
        setRadius(e.target.value);
    }

    const createMarker = (place) => {
        const marker = new window.google.maps.Marker({
            map: map,
            position: place.geometry.location,
            name: place.name,
        });

        let infowindow = new window.google.maps.InfoWindow();

        window.google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map);
        });

        markers.current.push(marker);
    };

    // const removeMarkers = () => {

    //     markers.current.forEach(marker => {
    //         marker.setMap(null);
    //         marker.setVisible(false);
    //     })
    //     markers.current = [];
    // }

    const removeMarkers = () => {
        markers.current = markers.current.filter(marker => {
            const hasMatchingActivity = selectedActivities.some(activity => activity.name === marker.name);
            if (!hasMatchingActivity) {
                marker.setMap(null);
                marker.setVisible(false);
            }
            return hasMatchingActivity;
        });

        return markers.current;
    };

    const handleTextSearch = (e) => {
        e.preventDefault();

        if (markers.current) {
            removeMarkers();
        }
        // Create PlacesService instance using the map
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            keyword: type,
            location: { lat, lng },
            radius,
        }
        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // console.log(results)

                let activities = [];
                let ii = 0;
                while (activities.length < number && ii < results.length) {
                    if (results[ii].business_status === 'OPERATIONAL') {
                        activities.push(results[ii]);
                    }
                    ii += 1;
                }

                activities.forEach(result => {
                    createMarker(result);
                });

                let organizedActivities = activities.map((result) => {
                    const activity = {
                        name: result.name,
                        rating: result.rating,
                        location: result.geometry.location,
                        photoUrl: null,
                        price: null,
                    }
                    if (result.photos) {
                        activity.photoUrl = result.photos[0].getUrl();
                    }
                    if (result.price_level) {
                        activity.price = result.price_level;
                    }
                    return activity
                });

                setGeneratedActivities(organizedActivities);
                map.setCenter(activities[0].geometry.location)

                // remove all but the selected marker

            }
        })
    }


    useEffect(() => {
        removeMarkers();
    }, [selectedActivities])

    const handleSelectActivity = (activity) => {
        setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, activity])
        map.setCenter(activity.location)
    }

    const handleSaveItinerary = () => {
        const itinerary = {
            activities: [...selectedActivities]
        };
        dispatch(createItinerary(itinerary));
    }

    return (
        <>
            <div className="section-top">
                <div ref={mapRef} className="map">
                    Map
                </div>
                <div className="activities-selected">
                    {selectedActivities.map((activity, index) => (
                        <div key={index}>
                            <div>Name: {activity.name}</div>
                            <div>Rating: {activity.rating}</div>
                            {activity.photoUrl ? <img src={activity.photoUrl} alt="activity" height="100px" width="100px" /> : null}
                            {activity.price ? <div>Price: {activity.price}</div> : null}
                        </div>
                    ))}
                    <div>
                        <button onClick={handleSaveItinerary}>Save Itinerary</button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className="section-bottom">
                <div>
                    <div>Location
                        <input type="text" value={location} onChange={handleLocation} placeholder="type in a city ex. brooklyn, ny" />
                    </div>
                    <div>
                        Type
                        <input type="text" value={type} onChange={handleType} />
                    </div>
                    <div>
                        Radius
                        <input type="number" value={radius} min={500} max={10000} step={100} onChange={handleRadius} />
                    </div>
                    <div>
                        Number
                        <input type="number" value={number} min={0} max={5} step={1} onChange={handleNumber} />
                    </div>
                    <div>
                        <button onClick={handleTextSearch}>textSearch</button>
                    </div>
                </div>
                <div className="activity-generated-row">
                    {generatedActivities.map((activity, index) => (
                        <div
                            className="activity-generated-item"
                            key={index}
                            onClick={() => handleSelectActivity(activity)}

                        >
                            <div>Name: {activity.name}</div>
                            <div>Rating: {activity.rating}</div>
                            {activity.photoUrl ? <img src={activity.photoUrl} alt="activity" height="200px" width="200px" /> : null}
                            {activity.price ? <div>Price: {activity.price}</div> : null}
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

const ItineraryMapWrapper = () => {
    return (
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <ItineraryMap />
        </Wrapper>
    );
}

export default ItineraryMapWrapper;
