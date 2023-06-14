import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import '../ItineraryShowPage/ItineraryShowPage.css'
import './ItineraryMap.css';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createItinerary } from "../../store/itineraries";
import activityTypes from "./ActivityTypes";
import ActivityItem from "../ItineraryShowPage/ActivityItem";

const ItineraryMap = ({ mapOptions = {} }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0)

    const [map, setMap] = useState(null);
    const [type, setType] = useState(typeParam);
    const [number, setNumber] = useState(3);

    const mapRef = useRef(null);
    const markers = useRef([]);
    const history = useHistory();

    const [selectedActivities, setSelectedActivities] = useState([]); // selected activity for itinerary
    const [generatedActivities, setGeneratedActivities] = useState([]);

    // set location for search on loadup
    useEffect(() => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ 'address': locationParam }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                setLat(location.lat());
                setLng(location.lng());
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        // // Use latitude and longitude values in your application
                        setLat(latitude);
                        setLng(longitude);
                    });
                } else {
                    // Geolocation is not supported by the browser
                    // default to App Academy
                    setLat(40.7271066);
                    setLng(-73.9947448);
                }
            }
        })
    }, [])

    // Create the initial map ONLY after lat and lng are set after geocoding's successful callback
    useEffect(() => {
        if (lat !== 0 && lng !== 0 && !map) {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: 15,
                // clickableIcons: false,
                ...mapOptions,
            });
            setMap(newMap);
        }
    }, [lat, lng]);

    // Run search after map is loaded
    useEffect(() => {
        handleTextSearch()
    }, [map])

    useEffect(() => {
        removeMarkers();
        let prevActivity = selectedActivities[selectedActivities.length-1];
        if (prevActivity) {
            handleTextSearch(null, prevActivity, generateRandomType());
        }
    }, [selectedActivities])

    const generateRandomType = () => {
        return activityTypes[Math.floor(Math.random()*activityTypes.length)];
    }

    const handleType = (e) => {
        setType(e.target.value);
    }
    const handleNumber = (e) => {
        setNumber(e.target.value);
    }

    const createMarker = (place) => {
        const marker = new window.google.maps.Marker({
            map: map,
            position: place.geometry.location,
            name: place.name,
        });

        const infowindow = new window.google.maps.InfoWindow({
            content: place.name || "",
        });

        window.google.maps.event.addListener(marker, "click", () => {
            infowindow.open(map, marker);
        });

        markers.current.push(marker);
    };

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

    const handleTextSearch = (e, prevActivity, newType, searchRadius) => {
        e?.preventDefault();

        if (markers.current) {
            removeMarkers();
        }
        // Create PlacesService instance using the map
        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: newType ? newType : type,
            location: prevActivity ? {lat: prevActivity.lat, lng: prevActivity.lng} : { lat, lng },
            radius: searchRadius,
        }

        if (lat !== 0 && lng !== 0) {
            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    let activities = [];
                    let ii = 0;
                    while (activities.length < number && ii < results.length) {
                        if (results[ii].business_status === 'OPERATIONAL' &&
                            results[ii].name !== prevActivity?.name &&
                            !selectedActivities.some(activity => activity.name === results[ii].name)) {
                                if (results[ii].photos) { // reject if no photos
                                    activities.push(results[ii]);
                                }
                        }
                        ii += 1;
                    }

                    if (activities.length !== number) {
                        // expand search radius until we find enough suggestions
                        redoSearch(e, prevActivity, newType, searchRadius)
                    } else {
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
                                place_id: result.place_id
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
                        // map.setCenter({lat, lng})
                        // remove all but the selected marker
                    }


                } else {
                    redoSearch(e, prevActivity, newType, searchRadius)
                }
            })
        }
    }

    const redoSearch = (e, prevActivity, newType, searchRadius) => {
        if (searchRadius < 10000) {
            handleTextSearch(e, prevActivity, newType, searchRadius+500)
        }
    }

    const handleSelectActivity = (activity) => {
        // get more details about activity
        const service = new window.google.maps.places.PlacesService(map);
        const request = { placeId: activity.place_id }
        service.getDetails(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                let detailedActivity = {
                    name: results.name,
                    rating: results.rating,
                    streetAddress: results.formatted_address,
                    location: results.geometry.location,
                    lat: results.geometry.location.lat(),
                    lng: results.geometry.location.lng(),
                    url: results.url,
                    type
                }
                let photoURLs = [];
                if (results.photos) {
                    results.photos.forEach(photo => {
                        photoURLs.push(photo.getUrl());
                    })
                }
                detailedActivity.photoURLs = photoURLs;
                detailedActivity.photoUrl = photoURLs[0];

                // save activity
                setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, detailedActivity])
                // move map
                map.setCenter(activity.location)
                // reset coordinates for next activity
                setLat(parseFloat(detailedActivity.lat))
                setLng(parseFloat(detailedActivity.lng))

                // reset generated activities
                setGeneratedActivities([])

                // redo search in useEffect for selectedActivities
            }
        })
    }

    const handleSaveItinerary = () => {
        const itinerary = {
            activities: [...selectedActivities]
        };
        dispatch(createItinerary(itinerary))
            .then(itinerary => {
                console.log(itinerary)
                history.push(`/itineraries/${itinerary._id}`)
            })
    }

    return (
        <>
            <div className="section-top">
                <div ref={mapRef} className="itinerary-show-map">
                    Map
                </div>
                <div className="itinerary-show-details">
                    {selectedActivities.map((activity, index) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                    <div>
                        <button onClick={handleSaveItinerary}>Save Itinerary</button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className="section-bottom">
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
