import './ItineraryShowPage.css';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { fetchItinerary, getItinerary, removeActivity } from '../../store/itineraries';
import activityTypes from '../ItineraryMap/ActivityTypes';
import ActivityItem from './ActivityItem';
import { getCurrentUser } from '../../store/session';
import { selectCurrentUser } from '../../store/session';

const ItineraryShow = ({ mapOptions = {} }) => {
    const { itineraryId } = useParams();
    const dispatch = useDispatch();

    const [map, setMap] = useState(null);
    const [number, setNumber] = useState(3);
    const [infoWindows, setInfoWindows] = useState([])

    const mapRef = useRef(null);
    const selectedMarkers = useRef([]);
    const searchedMarkers = useRef([]);

    const currentUser = useSelector(selectCurrentUser);
    const itinerary = useSelector(getItinerary(itineraryId));
    const selectedActivities = itinerary ? itinerary.activities : null;
    const [generatedActivities, setGeneratedActivities] = useState([]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const createSelectedMarker = (map, place) => {
        const location = { lat: place.lat, lng: place.lng }

        //  create marker and assign to map
        const marker = new window.google.maps.Marker({
            map: map,
            position: location,
            title: place.name,
            icon: icons.blue.icon
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
        console.log(selectedMarkers);
    };

    const createSearchedMarker = (map, place) => {
        //  create marker and assign to map

        // const lat = place.geometry.location.lat();
        // const lng = place.geometry.location.lng();

        const marker = new window.google.maps.Marker(mapRef.current, {
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: icons.blue.icon
        });
        marker.setAnimation(window.google.maps.Animation.BOUNCE)

        // create infowindow for marker
        // const infowindow = new window.google.maps.InfoWindow({
        //     content: marker.title || "",
        // });
        // window.google.maps.event.addListener(marker, "click", () => {
        //     infoWindows.forEach((infoWindow) => {
        //         infoWindow.close();
        //     });
        //     infowindow.open(map, marker);
        // });
        // infoWindows.push(infowindow);

        // add marker to markers array
        console.log("bottom of createSearchedMarker");
        searchedMarkers.current.push(marker);
    };

    useEffect(() => {
        console.log("inmarkersuseeffect");
        if (searchedMarkers.current.length > 0) {
            console.log("in here?");
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

            searchedMarkers.current.forEach(marker => {
                marker.setMap(newMap);
            });

            selectedMarkers.current.forEach(marker => {
                marker.setMap(newMap);
            });

            setMap(newMap);
        }
    }, [searchedMarkers.current]);


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

    const handleUpdateItinerary = () => {
        setIsUpdating(true);
    };

    const generateRandomType = () => {
        return activityTypes[Math.floor(Math.random() * activityTypes.length)];
    }
    const handleRemoveActivity = (activity) => {
        dispatch(removeActivity(activity._id));

        let prevActivity = selectedActivities[selectedActivities.length - 2];
        console.log(prevActivity);
        handleTextSearch(null, prevActivity, generateRandomType())
    }

    const handleSaveItinerary = () => {

        setIsSaved(false);
    };

    // const iconBase = 'http://google.com/mapfiles/ms/micons';
    const icons = {
        blue: {
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
        }
    };


    const handleTextSearch = (e, prevActivity, type, searchRadius) => {
        e?.preventDefault();
        console.log(prevActivity);
        console.log(type);
        // if (selectedMarkers.current) {
        //     removeMarkers();
        // }

        // Create PlacesService instance using the map
        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: type,
            location: { lat: prevActivity.lat, lng: prevActivity.lng },
            radius: searchRadius,
        }

        service.nearbySearch(request, (results, status) => {
            console.log("in nearbySearch");
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log("status was ok");
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
                console.log(searchedActivities);

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

    // const handleSelectActivity = (activity) => {
    //     // get more details about activity
    //     const service = new window.google.maps.places.PlacesService(map);
    //     const request = { placeId: activity.place_id }
    //     service.getDetails(request, (results, status) => {
    //         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //             let detailedActivity = {
    //                 name: results.name,
    //                 rating: results.rating,
    //                 streetAddress: results.formatted_address,
    //                 location: results.geometry.location,
    //                 lat: results.geometry.location.lat(),
    //                 lng: results.geometry.location.lng(),
    //                 url: results.url,
    //                 type
    //             }
    //             let photoURLs = [];
    //             if (results.photos) {
    //                 results.photos.forEach(photo => {
    //                     photoURLs.push(photo.getUrl());
    //                 })
    //             }
    //             detailedActivity.photoURLs = photoURLs;
    //             detailedActivity.photoUrl = photoURLs[0];

    //             // save activity
    //             setSelectedActivities(prevSelectedActivities => [...prevSelectedActivities, detailedActivity])
    //             // move map
    //             map.setCenter(activity.location)
    //             // reset coordinates for next activity
    //             setLat(parseFloat(detailedActivity.lat))
    //             setLng(parseFloat(detailedActivity.lng))

    //             // reset generated activities
    //             setGeneratedActivities([])

    //             // redo search in useEffect for selectedActivities
    //         }
    //     })
    // }

    useEffect(() => {
        dispatch(fetchItinerary(itineraryId));
        dispatch(getCurrentUser());
    }, [])

    useEffect(() => {
        console.log("hi");
        if (selectedActivities) {
            console.log(map);
            console.log(selectedActivities);

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


    // if (!itinerary.activities) return <> <h1>Loading...</h1> </> // maybe change this line in future for more robust

    return (
        <>
            <div className='show-title-holder'>
                {itinerary &&
                    <>
                        <div className='show-page-title'>{itinerary.title}</div>
                        <div className='show-page-creator'><p>Created by</p>{itinerary.creator}</div>
                    </>
                }
            </div>

            <div className="flex-row-wrap">
                <div ref={mapRef} className="itinerary-show-map">
                    {/* Map */}
                </div>
                <div className="itinerary-show-details">
                    {selectedActivities && !isUpdating && itinerary.activities.map((activity) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                    {selectedActivities && isUpdating && itinerary.activities.map((activity) => {
                        return (
                            <>
                                <button className='remove-activity-button' onClick={() => handleRemoveActivity(activity)}>X</button>
                                <ActivityItem activity={activity} key={activity._id} />
                            </>
                        )
                    })}
                </div>
            </div>
            <div>
                {currentUser && itinerary && currentUser._id === itinerary.creatorId
                    && <div>
                        {isUpdating ? (
                            <button >Save Itinerary</button>
                        ) : (
                            <button onClick={handleUpdateItinerary}>Edit Itinerary</button>
                        )}
                    </div>}
                {/* <button>Update Itinerary</button> */}
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
                            // onClick={() => handleSelectActivity(activity)}
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
                </div>
            </div>
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