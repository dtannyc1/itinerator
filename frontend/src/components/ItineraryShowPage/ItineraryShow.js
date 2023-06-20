import './ItineraryShowPage.css';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { addActivity, fetchItinerary, getItinerary, removeActivity, updateItinerary, deleteItinerary } from '../../store/itineraries';
import activityTypes from '../ItineraryMap/ActivityTypes';
import ActivityItem from './ActivityItem';
import { getCurrentUser } from '../../store/session';
import { selectCurrentUser } from '../../store/session';
import { Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import CommentItem from './CommentItem';
import { createLike, deleteLike } from '../../store/likes';
import { Modal } from '../context/Modal';
import LoginForm from '../SessionForms/LoginForm';
import CommentForm from './CommentForm';

const ItineraryShow = ({ mapOptions = {} }) => {

    const { itineraryId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [liked, setLiked] = useState(false);


    const [map, setMap] = useState(null);
    const [number, setNumber] = useState(3);

    const mapRef = useRef(null);
    const selectedMarkers = useRef([]);
    const generatedMarkers = useRef([]);

    const currentUser = useSelector(selectCurrentUser);
    const itinerary = useSelector(getItinerary(itineraryId));

    let lastActivitylat;
    let lastActivitylng;
    if (itinerary) {
        const lastActivity = itinerary.activities[itinerary.activities.length - 1];
        lastActivitylat = lastActivity.lat
        lastActivitylng = lastActivity.lng
        // we use these coordinates when we don't have a prevActivity
    }
    const [lat, setLat] = useState(lastActivitylat || 40.7271066);
    const [lng, setLng] = useState(lastActivitylng || -73.9947448);

    const [generatedActivities, setGeneratedActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState(itinerary?.activities);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ------------- NEEDED FOR REFRESH ----------------------
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

    useEffect(() => {
        setSelectedActivities(itinerary?.activities)
    }, [itinerary])

    useEffect(() => {
        dispatch(fetchItinerary(itineraryId));
        dispatch(getCurrentUser());
    }, [])
    // --------------------------------------------------------

    // creates selected markers from selectedActivities array
    // adds them to selectedMarkers[]
    useEffect(() => {
        if (selectedActivities?.length && map) {
            setMarkers();
        }
    }, [selectedActivities, map])

    useEffect(() => {
        if (generatedActivities.length) {
            setMarkers();
        }
    }, [generatedActivities])

    useEffect(() => {
        if (isUpdating) {
            removeAllMarkers();
            let prevActivity = selectedActivities[selectedActivities.length - 1];
            if (prevActivity) {
                handleTextSearch(null, prevActivity, generateRandomType());
            }
        }
    }, [selectedActivities])
    // when you remove/add an activity, this runs.
    // this always generates activities, which will run the above useEffect when there are 3.

    useEffect(() => {
        checkLikeStatus();
    }, []);

    // ------------- END OF USEEFFECTS ----------------------


    const infoWindows = [];
    const icons = {
        blueBlank: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png"
        },
        blueDot: {
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
        },
        blueStar: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/blu-stars.png"
        },
        orangeBlank: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/orange-blank.png"
        },
        orangeDot: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/orange-circle.png"
        },
        orangeStar: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/orange-stars.png"
        }
    };

    // sets NEWLY generated markers and selected markers
    const setMarkers = () => {

        selectedActivities.forEach((place, ii) => {
            createSelectedMarker(place, ii);
        });
        const bounds = new window.google.maps.LatLngBounds();
        const allMarkers = [...generatedMarkers.current, ...selectedMarkers.current];

        allMarkers.forEach(marker => {
            marker.setMap(map);
            const position = marker.position;
            bounds.extend(position)
        });
        map.fitBounds(bounds);
    };

    const removeAllMarkers = () => {
        generatedMarkers.current.forEach(marker => {
            marker.setMap(null);
            marker.setVisible(false);
        });
        generatedMarkers.current = []

        selectedMarkers.current.forEach(marker => {
            marker.setMap(null);
            marker.setVisible(false);
        });
        selectedMarkers.current = [];
    };

    const createSelectedMarker = (place, ii) => {
        const location = { lat: place.lat, lng: place.lng }
        const marker = new window.google.maps.Marker({
            // map: map,
            position: location,
            title: place.name,
            icon: icons.orangeBlank.icon,
            label: { text: (ii + 1).toString(), className: 'marker-label' }
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

        selectedMarkers.current.push(marker);
    }

    const createGeneratedMarker = (place) => {
        const marker = new window.google.maps.Marker({
            // map: map,
            position: place.geometry.location,
            title: place.name,
            icon: icons.orangeBlank.icon
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

    const handleUpdateItinerary = () => {
        setIsUpdating(true);
        let prevActivity = selectedActivities[selectedActivities.length - 1];
        if (prevActivity) {
            handleTextSearch(null, prevActivity, generateRandomType());
        }
    };

    const generateRandomType = () => {
        return activityTypes[Math.floor(Math.random() * activityTypes.length)];
    }

    const handleRemoveActivity = (activity) => {
        setSelectedActivities(selectedActivities.filter(act => act._id !== activity._id));
    }

    // gets the most recent selectedActivity (currently selected)
    const getPrevActivity = () => {
        if (selectedActivities.length > 0) {
            const lastActivity = selectedActivities[selectedActivities.length - 1];
            const lat = lastActivity.lat;
            const lng = lastActivity.lng;
            return { lat: lat, lng: lng }
        } else {
            return { lat: 40.7271066, lng: -73.9947448 }
        }
    }

    const handleTextSearch = (e, prevActivity, type, searchRadius) => {
        e?.preventDefault();

        if (generatedActivities.length) {
            generatedMarkers.current.forEach((marker) => {
                marker.setMap(null);
                marker.setVisible(false);
            })
            generatedMarkers.current = [];
        }

        // Create PlacesService instance using the map
        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: type,
            location: prevActivity ? { lat: prevActivity.lat, lng: prevActivity.lng } : getPrevActivity(),
            radius: searchRadius,
        }

        setIsLoading(true);
        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                let searchedActivities = [];
                let ii = 0;
                while (searchedActivities.length < number && ii < results.length) {
                    if (results[ii].business_status === 'OPERATIONAL' &&
                        results[ii].name !== prevActivity?.name &&
                        !selectedActivities.some(activity => activity.name === results[ii].name)) {
                        if (results[ii].photos) { // reject if no photos
                            searchedActivities.push(results[ii]);
                        }
                    }
                    ii += 1;
                }

                if (searchedActivities.length !== number) {
                    // expand search radius until we find enough suggestions
                    redoSearch(e, prevActivity, type, searchRadius)
                } else {
                    searchedActivities.forEach(place => {
                        createGeneratedMarker(place);
                    });

                    let organizedActivities = searchedActivities.map((result) => {
                        const activity = {
                            name: result.name,
                            rating: result.rating,
                            location: result.geometry.location,
                            photoUrl: null,
                            price: null,
                            place_id: result.place_id,
                            url: results.url,
                            type: type
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
                    setIsLoading(false)
                }
            } else {
                redoSearch(e, prevActivity, type, searchRadius)
            }
        })
    }

    const redoSearch = (e, prevActivity, type, searchRadius) => {
        if (searchRadius < 10000) {
            handleTextSearch(e, prevActivity, type, searchRadius + 500)
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
                    type: activity.type
                }
                let photoURLs = [];
                if (results.photos) {
                    results.photos.forEach(photo => {
                        photoURLs.push(photo.getUrl());
                    })
                }
                detailedActivity.photoURLs = photoURLs;
                detailedActivity.photoUrl = photoURLs[0];

                createSelectedMarker(detailedActivity);
                setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, detailedActivity])

                // reset generated activities
                setGeneratedActivities([])

                // redo search in useEffect for selectedActivities
            }
        })
    }

    const handleSaveItinerary = () => {
        generatedMarkers.current.forEach(marker => {
            marker.setMap(null);
            marker.setVisible(false);
        });
        generatedMarkers.current = []

        const itinerary = {
            activities: [...selectedActivities]
        };
        setIsUpdating(false);
        dispatch(updateItinerary(itineraryId, itinerary))
            .then((itinerary) => {
                history.push(`/itineraries/${itinerary._id}`)
                // history.push('/itineraries/')
            })
        setGeneratedActivities([]);
    };

    const handleDeleteItinerary = () => {
        setIsUpdating(true);
        dispatch(deleteItinerary(itineraryId))
            .then(() => {
                history.push('/');
            });
    }

    const handleMouseEnter = (activity) => {
        // Find the marker by title
        const marker = generatedMarkers.current.find(marker => marker.title === activity.name);
        if (marker) {
            // Change the marker when the item is hovered over
            marker.setIcon("http://maps.google.com/mapfiles/kml/paddle/orange-circle.png");
            // marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
    };

    const handleMouseLeave = (activity) => {
        // Find the marker by title
        const marker = generatedMarkers.current.find(marker => marker.title === activity.name);
        if (marker) {
            // Change the marker back to its original state when the mouse leaves the item
            marker.setIcon("http://maps.google.com/mapfiles/kml/paddle/orange-blank.png");
            // marker.setAnimation(null); // Removes the bounce animation
        }
    };

    const commentsSection = (
        <div className='comments-wrap'>
            {itinerary?.comments.map((comment) => {
                return <CommentItem comment={comment} key={comment._id} />
            })}
        </div>
    )
    // if (!itinerary.activities) return <> <h1>Loading...</h1> </> // maybe change this line in future for more robust


    const checkLikeStatus = async () => {
        const isLiked = await likesSearch();
        setLiked(isLiked || false);
    };

    const likesSearch = () => {
        if (!currentUser) return false
        return itinerary?.likes.some((like) => like.likerId === currentUser._id);
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

    const handleLike = async () => {
        if (currentUser) {
            // const isLiked = await likesSearch();
            if (liked) {
                dispatch(deleteLike(itinerary._id));
                setLiked(false);
            } else {
                dispatch(createLike(itinerary._id));
                setLiked(true);
            }
        } else {
            setShowModal(true);
        }
    }

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
            {loginModal}

            <div className='show-title-holder'>
                {itinerary &&
                    <>
                        <div className='title-holder'>
                            <div className='show-page-title'>{itinerary.title}</div>
                            <div className='show-page-creator'><p>Created by</p>{itinerary.creator}</div>
                        </div>
                        <div className='likes-holder'>
                            <div className={`${liked ? '' : 'liked'}`} >{itinerary.likes.length}</div>
                            <i className={`fa-solid fa-heart fa-2xl ${liked ? 'liked' : ''}`} onClick={handleLike}></i>
                        </div>
                    </>
                }
            </div>

            <div className="flex-row-wrap section-mid">
                <div ref={mapRef} className="itinerary-show-map" id="itinerary-show-map-modified">
                    {/* Map */}
                </div>
                <div className={`itinerary-show-details${!isUpdating ? " not-updating" : ""}`} id="itinerary-show-details-modified">
                    {selectedActivities && !isUpdating && itinerary.activities.length && itinerary.activities.map((activity) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                    {selectedActivities && isUpdating && selectedActivities.map((activity) => {
                        return (
                            <>
                                <ActivityItem activity={activity} key={activity._id} handleRemoval={handleRemoveActivity} />
                            </>
                        )
                    })}
                </div>
            </div>

            <div className="section-bottom">
                <div className="section-left">
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Museum', null) }}>
                        <i className="fa-solid fa-building-columns fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Bar', null) }}>
                        <i className="fa-solid fa-martini-glass fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Park', null) }}>
                        <i className="fa-solid fa-tree fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Bowling and Pool', null) }}>
                        <i className="fa-solid fa-bowling-ball fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Movie and Theater', null) }}>
                        <i className="fa-solid fa-clapperboard fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Cafe', null) }}>
                        <i className="fa-solid fa-mug-hot fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Pool and Ice skating', null) }}>
                        <i className="fa-solid fa-person-swimming fa-2xl"></i>
                    </div>
                    <div className="create-page-circle" onClick={e => { if (isUpdating) handleTextSearch(null, null, 'Restaurants', null) }}>
                        <i className="fa-solid fa-utensils fa-2xl"></i>
                    </div>
                </div>

                <div className="section-right">
                    <div className="activity-generated-row">
                        {isLoading ? loadingAnimation :
                            generatedActivities.map((activity, index) => (
                                <div
                                    className="activity-generated-item"
                                    key={index}
                                    onClick={() => handleSelectActivity(activity)}
                                    onMouseEnter={() => handleMouseEnter(activity)}
                                    onMouseLeave={() => handleMouseLeave(activity)}
                                >
                                    {activity.photoUrl ? <img className="choice-img" src={activity.photoUrl} alt="activity" /> : null}
                                    <div className="choice-activity-name">{activity.name}</div>
                                    <div className="activity-place-rating" id="activity-place-rating-modified">

                                        {Array.from({ length: activity.rating }, (_, index) => (
                                            <i key={index} className="star-rating-ico"></i>
                                        ))}
                                        {activity.rating % 1 !== 0 && (
                                            <i className="star-rating-ico-half"></i>
                                        )}
                                        {activity.rating === '0' ? <></> : activity.rating}

                                    </div>

                                </div>
                            ))
                        }
                    </div>

                    <div>
                        {currentUser && itinerary && currentUser._id === itinerary.creatorId
                            && <div className='input-button-capsule'>
                                {isUpdating ? (
                                    <button className="nav-button" onClick={handleSaveItinerary}>Save Itinerary</button>
                                ) : (
                                    <>
                                        <button className="nav-button" onClick={handleUpdateItinerary}>Edit Itinerary</button>
                                        <button className="nav-button" onClick={handleDeleteItinerary}>Delete Itinerary</button>
                                    </>
                                )}
                            </div>}
                    </div>
                </div>
            </div>

            <CommentForm />
            {commentsSection}
        </>
    )
}

const ItineraryMapWrapper = () => {
    return (
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <ItineraryShow />
        </Wrapper>
    );
}

export default ItineraryMapWrapper;
