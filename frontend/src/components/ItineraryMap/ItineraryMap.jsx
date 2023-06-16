import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import '../ItineraryShowPage/ItineraryShowPage.css'
import './ItineraryMap.css';
import './LoadingAnimation.css';

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createItinerary } from "../../store/itineraries";
import activityTypes from "./ActivityTypes";
import ActivityItem from "../ItineraryShowPage/ActivityItem";
import InstructionsModal from "./InsructionsModal";
import { selectCurrentUser } from "../../store/session";
import LoginForm from "../SessionForms/LoginForm";
import { Modal } from "../context/Modal";

const ItineraryMap = ({ mapOptions = {} }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');
    const currentUser = useSelector(selectCurrentUser);

    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [map, setMap] = useState(null);
    const [type, setType] = useState(typeParam);
    const [number, setNumber] = useState(3);
    const [itineraryTitle, setItineraryTitle] = useState('');
    const [showModal, setShowModal] = useState(false);

    const mapRef = useRef(null);
    const generatedMarkers = useRef([]);
    const selectedMarkers = useRef([]);
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

    // Run initial search after map is loaded
    useEffect(() => {
        handleTextSearch()
    }, [map])

    useEffect(() => {
        if (generatedMarkers) removeGeneratedMarkers();
        let prevActivity = selectedActivities[selectedActivities.length - 1];
        if (prevActivity) {
            handleTextSearch(null, prevActivity, generateRandomType());
        }
    }, [selectedActivities])

    useEffect(() => {
        if (generatedActivities.length) setMarkers()
    }, [generatedActivities])

    // removes all generated markers before generating new searches/markers (in handleTextSearch)
    const removeGeneratedMarkers = () => {
        // markers.current = markers.current.filter(marker => {
        //     const hasMatchingActivity = selectedActivities.some(activity => activity.name === marker.name);
        //     if (!hasMatchingActivity) {
        //         marker.setMap(null);
        //         marker.setVisible(false);
        //     }
        //     return hasMatchingActivity;
        // });

        // return markers.current;

        generatedMarkers.current.forEach(marker => {
            marker.setMap(null);
            marker.setVisible(false);
        })
    };

    // sets NEW generated markers and selected markers
    const setMarkers = () => {
        console.log(map);
        const bounds = new window.google.maps.LatLngBounds();
        const allMarkers = [...generatedMarkers.current, ...selectedMarkers.current];
        console.log(generatedMarkers.current);
        console.log(selectedMarkers.current);
        console.log(allMarkers);
        allMarkers.forEach(marker => {
            marker.setMap(map);
            const position = marker.position;
            bounds.extend(position)
        });
        map.fitBounds(bounds);
    };

    const generateRandomType = () => {
        return activityTypes[Math.floor(Math.random() * activityTypes.length)];
    }

    // const createMarker = (place) => {
    //     const marker = new window.google.maps.Marker({
    //         map: map,
    //         position: place.geometry.location,
    //         name: place.name,
    //     });

    //     const infowindow = new window.google.maps.InfoWindow({
    //         content: place.name || "",
    //     });

    //     window.google.maps.event.addListener(marker, "click", () => {
    //         infowindow.open(map, marker);
    //     });

    //     markers.current.push(marker);
    // };

    const infoWindows = [];
    const icons = {
        blueDot: {
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
        },
        blue: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/purple-blank.png"
        }
    };

    const createGeneratedMarker = (place) => {
        const marker = new window.google.maps.Marker({
            // map: map,
            position: place.geometry.location,
            title: place.name,
            icon: icons.blue.icon
        });
        marker.setAnimation(window.google.maps.Animation.BOUNCE)

        // create infowindow for marker
        const infowindow = new window.google.maps.InfoWindow();
        infowindow.setContent(`
            <div>
                <h3>${marker.title}</h3>
                <a href="${place.url}" target="_blank">Visit Page</a>
            </div>
        `)

        window.google.maps.event.addListener(marker, "click", () => {
            infoWindows.forEach((infoWindow) => {
                infoWindow.close();
            });
            infowindow.open(map, marker);
        });
        infoWindows.push(infowindow);

        generatedMarkers.current.push(marker);
    };

    const createSelectedMarker = (place) => {
        const location = { lat: place.lat, lng: place.lng }
        //  create marker and assign to map
        const marker = new window.google.maps.Marker({
            // map: map,
            position: location,
            title: place.name,
            icon: icons.blueDot.icon
        });
        // create infowindow for marker
        const infowindow = new window.google.maps.InfoWindow();
        infowindow.setContent(`
            <div>
                <h3>${marker.title}</h3>
                <a href="${place.url}" target="_blank">Visit Page</a>
            </div>
        `)
        window.google.maps.event.addListener(marker, "click", () => {
            infoWindows.forEach((infoWindow) => {
                infoWindow.close();
            });
            infowindow.open(map, marker);
        });
        infoWindows.push(infowindow);

        // add marker to markers array
        selectedMarkers.current.push(marker);
    }

    const handleTextSearch = (e, prevActivity, newType, searchRadius) => {
        e?.preventDefault();

        // Create PlacesService instance using the map
        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: newType ? newType : type,
            location: prevActivity ? { lat: prevActivity.lat, lng: prevActivity.lng } : { lat, lng },
            radius: searchRadius,
        }

        if (service && lat !== 0 && lng !== 0) {
            setIsLoading(true);
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
                            createGeneratedMarker(result);
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
                        setIsLoading(false);
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
            handleTextSearch(e, prevActivity, newType, searchRadius + 500)
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

                console.log(JSON.stringify(detailedActivity))
                detailedActivity.photoUrl = photoURLs[0];

                // save activity
                setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, detailedActivity])
                // move map
                map.setCenter(activity.location)
                // reset coordinates for next activity
                setLat(parseFloat(detailedActivity.lat))
                setLng(parseFloat(detailedActivity.lng))

                createSelectedMarker(detailedActivity)

                // reset generated activities
                setGeneratedActivities([])

                // redo search in useEffect for selectedActivities
            }
        })
    }

    const loginModal = (
        <>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <LoginForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );

    const handleSaveItinerary = () => {
        const itinerary = {
            title: itineraryTitle,
            activities: [...selectedActivities]
        };

        if (currentUser) {
            dispatch(createItinerary(itinerary))
                .then(itinerary => {
                    history.push(`/itineraries/${itinerary._id}`)
                })
        } else {
            setShowModal(true)
        }
    };

    const activitiesChoiceRow = (
        generatedActivities.map((activity, index) => (
            <div
                className={`activity-generated-item`}
                key={index}
                onClick={() => handleSelectActivity(activity)}
            >
                {activity.photoUrl ? <img className="choice-img" src={activity.photoUrl} alt="activity" /> : null}
                <div className="choice-activity-name">{activity.name}</div>
                <div className="activity-place-rating" id="activity-place-rating-modified">

                    {activity.rating === '0' ? <></> : <div className="rating-wrap">{activity.rating}</div>}
                    {Array.from({ length: activity.rating }, (_, index) => (
                        <i key={index} className="create-star-rating-ico"></i>
                    ))}
                    {activity.rating % 1 !== 0 && (
                        <i className="create-star-rating-ico-half"></i>
                    )}


                </div>

            </div>
        ))
    );

    const loadingAnimation = (
        <div className="loading-wrap">
            <div className="loading-title">Loading top choices...</div>
            <div className="animation-box">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    )

    return (
        <>


            <div className="section-top">
                <div ref={mapRef} className="itinerary-show-map" id="itinerary-show-map-modified">
                    Map
                </div>
                <div className="itinerary-show-details" id="itinerary-show-details-modified">
                    {selectedActivities.map((activity, index) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                </div>
            </div>

            <div className="section-bottom">
                <div className="section-left">
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Museum', null)}>
                        <i className="fa-solid fa-building-columns fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Bar', null)}>
                        <i className="fa-solid fa-martini-glass fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Park', null)}>
                        <i className="fa-solid fa-tree fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Bowling and Pool', null)}>
                        <i className="fa-solid fa-bowling-ball fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Moovie and Theater', null)}>
                        <i className="fa-solid fa-clapperboard fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Cafe', null)}>
                        <i className="fa-solid fa-mug-hot fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Pool and Ice skating', null)}>
                        <i className="fa-solid fa-person-swimming fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => handleTextSearch(null, null, 'Restaurants', null)}>
                        <i className="fa-solid fa-utensils fa-2xl"></i>
                    </div>
                </div>



                <div className="section-right">
                    <div className="activity-generated-row">
                        {isLoading ? loadingAnimation : activitiesChoiceRow}
                    </div>

                    <div className="input-button-capsule">
                        <InstructionsModal />
                        <div>
                            <input
                                className="title-input"
                                type="text"
                                placeholder="itinerary name"
                                value={itineraryTitle}
                                onChange={e => setItineraryTitle(e.target.value)}
                            />
                            <button
                                id="nav-button-venture"
                                className="nav-button"
                                onClick={handleSaveItinerary}
                                disabled={!itineraryTitle && currentUser}
                            ><i className="fa-solid fa-plus"></i>itinerate!</button>
                        </div>
                    </div>

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
