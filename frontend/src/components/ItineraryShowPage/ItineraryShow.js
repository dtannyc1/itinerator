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

const ItineraryShow = ({ mapOptions = {} }) => {
    const { itineraryId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);

    const [map, setMap] = useState(null);
    const [number, setNumber] = useState(3);
    // const [infoWindows, setInfoWindows] = useState([])

    const mapRef = useRef(null);
    const selectedMarkers = useRef([]);
    const searchedMarkers = useRef([]);

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

    console.log("logging itinerary under");
    console.log(itinerary);
    // const selectedActivities = itinerary ? itinerary.activities : null;
    const [generatedActivities, setGeneratedActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState(itinerary?.activities);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // const [type, setType] = useState(null);
    const [lat, setLat] = useState(lastActivitylat || 40.7271066);
    const [lng, setLng] = useState(lastActivitylng || -73.9947448);

    const infoWindows = [];

    // ------------- NEEDED FOR REFRESH ----------------------
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

    useEffect(() => {
        setSelectedActivities(itinerary?.activities)
    }, [itinerary])
    // --------------------------------------------------------

    const createSelectedMarker = (map, place) => {
        const location = { lat: place.lat, lng: place.lng }
        //  create marker and assign to map
        const marker = new window.google.maps.Marker({
            map: map,
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

        const allMarkers = [...selectedMarkers.current, ...searchedMarkers.current];

        const bounds = new window.google.maps.LatLngBounds();

        allMarkers.forEach((marker) => {
            const position = marker.position;
            bounds.extend(position);
        });

        console.log("bottom of createSelectedMarker");
        map.fitBounds(bounds);
    };

    const createSearchedMarker = (map, place) => {
        //  create marker and assign to map

        const marker = new window.google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: icons.blue.icon
        });
        marker.setAnimation(window.google.maps.Animation.BOUNCE)

        // create infowindow for marker
        const infowindow = new window.google.maps.InfoWindow({
            content: marker.title || "",
        });
        window.google.maps.event.addListener(marker, "click", () => {
            infoWindows.forEach((infoWindow) => {
                infoWindow.close();
            });
            infowindow.open(map, marker);
        });
        infoWindows.push(infowindow);

        // add marker to markers array
        searchedMarkers.current.push(marker);

        // extending the bounds to now include all previous activities and newly generated activities
        const allMarkers = [...selectedMarkers.current, ...searchedMarkers.current];

        const bounds = new window.google.maps.LatLngBounds();

        allMarkers.forEach((marker) => {
            const position = marker.position;
            bounds.extend(position);
        });

        map.fitBounds(bounds);
    };


    const handleUpdateItinerary = () => {
        setIsUpdating(true);
    };

    const generateRandomType = () => {
        return activityTypes[Math.floor(Math.random() * activityTypes.length)];
    }
    const handleRemoveActivity = (activity) => {
        dispatch(removeActivity(activity._id));
        setSelectedActivities(selectedActivities.filter(act => act._id !== activity._id));
        // find the index of the marker related to the activity
        const markerIndex = selectedMarkers.current.findIndex(marker => marker.title === activity.name);
        if (markerIndex !== -1) {
            // remove marker from map
            selectedMarkers.current[markerIndex].setMap(null);
            // remove marker from array
            selectedMarkers.current.splice(markerIndex, 1);
        }
    }

    useEffect(() => {
        if (isUpdating && selectedActivities) {
            console.log(selectedActivities);
            let prevActivity = selectedActivities[selectedActivities.length - 1];
            console.log(prevActivity);
            handleTextSearch(null, prevActivity, generateRandomType())
        }
    }, [selectedActivities])


    const icons = {
        blueDot: {
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
        },
        blue: {
            icon: "http://maps.google.com/mapfiles/kml/paddle/purple-blank.png"
        }
    };


    const handleTextSearch = (e, prevActivity, type, searchRadius) => {
        e?.preventDefault();

        // Create PlacesService instance using the map
        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: type,
            location: prevActivity ? { lat: prevActivity.lat, lng: prevActivity.lng } : { lat, lng },
            radius: searchRadius,
        }

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
                        createSearchedMarker(map, place);
                    });

                    let organizedActivities = searchedActivities.map((result) => {
                        const activity = {
                            name: result.name,
                            rating: result.rating,
                            location: result.geometry.location,
                            photoUrl: null,
                            price: null,
                            place_id: result.place_id,
                            url: results.url
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
        console.log(activity);
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
                    type: results.type
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
                // dispatch(addActivity(activity));
                console.log(detailedActivity);
                createSelectedMarker(map, detailedActivity);
                setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, detailedActivity])
                // move map

                // reset coordinates for next activity
                // setLat(parseFloat(detailedActivity.lat))
                // setLng(parseFloat(detailedActivity.lng))

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
        const marker = searchedMarkers.current.find(marker => marker.title === activity.name);
        if (marker) {
            // Change the marker when the item is hovered over
            marker.setIcon('http://maps.google.com/mapfiles/kml/paddle/blu-circle.png');
            // marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
    };

    const handleMouseLeave = (activity) => {
        // Find the marker by title
        const marker = searchedMarkers.current.find(marker => marker.title === activity.name);
        if (marker) {
            // Change the marker back to its original state when the mouse leaves the item
            marker.setIcon("http://maps.google.com/mapfiles/kml/paddle/purple-blank.png");
            // marker.setAnimation(null); // Removes the bounce animation
        }
    };

    useEffect(() => {
        dispatch(fetchItinerary(itineraryId));
        dispatch(getCurrentUser());
    }, [])

    useEffect(() => {
        // removeMarkers();
        if (isUpdating) {
            let prevActivity = selectedActivities[selectedActivities.length - 1];
            if (prevActivity) {
                handleTextSearch(null, prevActivity, generateRandomType());
            }
        }
    }, [selectedActivities])

    useEffect(() => {
        if (selectedActivities) {

            // centering map at first activity
            // const centerLat = selectedActivities.length > 0 ? selectedActivities[0].lat : null;
            // const centerLng = selectedActivities.length > 0 ? selectedActivities[0].lng : null;
            // const newMap = new window.google.maps.Map(mapRef.current, {
            //     center: { lat: lat, lng: lng },
            //     zoom: 15,
            //     // ...mapOptions,
            // });
            // setMap(newMap);

            // creating a bounds encompassing all activities
            const bounds = new window.google.maps.LatLngBounds();
            selectedActivities.forEach((activity) => {
                const { lat, lng } = activity;
                const position = new window.google.maps.LatLng(lat, lng);
                bounds.extend(position);
            });
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: bounds.getCenter(),
                zoom: 14,
                ...mapOptions,
            });
            newMap.fitBounds(bounds);
            setMap(newMap);

            // add markers to map
            selectedActivities.forEach(place => {
                createSelectedMarker(newMap, place);
            });
        }
    }, [selectedActivities])

    const commentsSection = (
        <div className='comments-wrap'>
            {itinerary?.comments.map((comment) => {
                return <CommentItem comment={comment} key={comment._id} />
            })}
        </div>
    )
    // if (!itinerary.activities) return <> <h1>Loading...</h1> </> // maybe change this line in future for more robust
            
    const likesSearch = () => {
        return itinerary.likes.some((like) => like.likerId === currentUser._id);
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
        if(currentUser) {
            const isLiked = await likesSearch();
            if (isLiked) {
                dispatch(deleteLike(itinerary._id));
              } else {
                dispatch(createLike(itinerary._id));
              }
        } else {
            setShowModal(true);
        }
    }

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
                            <div>{itinerary.likes.length}</div>
                            <i className="fa-solid fa-heart fa-2xl" onClick={handleLike}></i>
                        </div>
                    </>
                }
            </div>

            <div className="flex-row-wrap section-mid">
                <div ref={mapRef} className="itinerary-show-map" id="itinerary-show-map-modified">
                    {/* Map */}
                </div>
                <div className="itinerary-show-details" id="itinerary-show-details-modified">
                    {selectedActivities && !isUpdating && itinerary.activities.length && itinerary.activities.map((activity) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                    {selectedActivities && isUpdating && selectedActivities.map((activity) => {
                        return (
                            <>
                                <ActivityItem activity={activity} key={activity._id} handleRemoval={handleRemoveActivity}/>
                            </>
                        )
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
                        {generatedActivities.map((activity, index) => (
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
                        ))}
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



  // const removeMarkers = () => {
    //     selectedMarkers.current.forEach((selectedMarker) => {
    //         selectedMarker.setMap(null);
    //         selectedMarker.setVisible(false);
    //     })
    //     selectedMarkers.current = [];

    //     searchedMarkers.current.forEach((unselectedMarker) => {
    //         unselectedMarker.setMap(null);
    //         unselectedMarker.setVisible(false);
    //     })
    //     searchedMarkers.current = [];
    // }

    // const addSelectedMarker = (marker) => {
    //     selectedMarkers.current.push(marker);
    //     marker.setMap(map);
    // };

    // const removeSelectedMarker = (marker) => {
    //     const index = selectedMarkers.current.indexOf(marker);
    //     if (index !== -1) {
    //         selectedMarkers.current.splice(index, 1);
    //         marker.setMap(null);
    //     }
    // };

    // const addUnselectedMarker = (marker) => {
    //     unselectedMarkers.current.push(marker);
    // };

    // const removeUnselectedMarker = (marker) => {
    //     const index = unselectedMarkers.current.indexOf(marker);
    //     if (index !== -1) {
    //         unselectedMarkers.current.splice(index, 1);
    //     }
    // };
