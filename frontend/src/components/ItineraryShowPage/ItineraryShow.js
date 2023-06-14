import './ItineraryShowPage.css';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { fetchItinerary, getItinerary } from '../../store/itineraries';
import ActivityItem from './ActivityItem';
import { getCurrentUser } from '../../store/session';
import { selectCurrentUser } from '../../store/session';

const ItineraryShow = () => {
    const { itineraryId } = useParams();
    const dispatch = useDispatch();
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const selectedMarkers = useRef([]);
    const unselectedMarkers = useRef([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedActivities, setSelectedActivities] = useState([]); // selected activity for itinerary
    const [generatedActivities, setGeneratedActivities] = useState([]);

    const itinerary = useSelector(getItinerary(itineraryId));
    // array of activities = [{}, {}, {}]
    const activities = itinerary ? itinerary.activities : null;
    // const [currentActivities, setCurrentActivities] = useState(activities)

    const currentUser = useSelector(selectCurrentUser);

    const infoWindows = [];

    const createMarker = (map, place) => {
        const location = { lat: place.lat, lng: place.lng }

        //  create marker and assign to map
        const marker = new window.google.maps.Marker({
            map: map,
            position: location,
            title: place.name,
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
        selectedMarkers.current.push(marker);
    };

    // const addSelectedMarker = (marker) => {
    //     selectedMarkers.current.push(marker);
    //     marker.setMap(map);
    // };

    // const removeMarkers = () => {
    //     selectedMarkers.current.forEach((selectedMarker) => {
    //         selectedMarker.setMap(null);
    //         selectedMarker.setVisible(false);
    //     })
    //     selectedMarkers.current = [];

    //     unselectedMarkers.current.forEach((unselectedMarker) => {
    //         unselectedMarker.setMap(null);
    //         unselectedMarker.setVisible(false);
    //     })
    //     unselectedMarkers.current = [];
    // }

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

    const handleRemoveActivity = (activity) => {
        // currentActivities.
        // I AM HERE
        // handleTextSearch(e, null, newType, searchRadius)
    }

    // const handleSaveItinerary = () => {

    //     setIsSaved(false);
    // };

    // const handleTextSearch = (e, prevActivity, newType, searchRadius) => {
    //     e?.preventDefault();

    //     if (selectedMarkers.current) {
    //         removeMarkers();
    //     }

    //     // I AM HERE

    //     // Create PlacesService instance using the map
    //     const service = map ? new window.google.maps.places.PlacesService(map) : null;
    //     searchRadius = searchRadius || 500;
    //     const request = {
    //         keyword: newType ? newType : type,
    //         location: prevActivity ? { lat: prevActivity.lat, lng: prevActivity.lng } : { lat, lng },
    //         radius: searchRadius,
    //     }

    //     if (lat !== 0 && lng !== 0) {
    //         service.nearbySearch(request, (results, status) => {
    //             if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //                 let activities = [];
    //                 let ii = 0;
    //                 while (activities.length < number && ii < results.length) {
    //                     if (results[ii].business_status === 'OPERATIONAL' &&
    //                         results[ii].name !== prevActivity?.name &&
    //                         !selectedActivities.some(activity => activity.name === results[ii].name)) {
    //                         if (results[ii].photos) { // reject if no photos
    //                             activities.push(results[ii]);
    //                         }
    //                     }
    //                     ii += 1;
    //                 }

    //                 if (activities.length !== number) {
    //                     // expand search radius until we find enough suggestions
    //                     redoSearch(e, prevActivity, newType, searchRadius)
    //                 } else {
    //                     activities.forEach(result => {
    //                         createMarker(result);
    //                     });

    //                     let organizedActivities = activities.map((result) => {
    //                         const activity = {
    //                             name: result.name,
    //                             rating: result.rating,
    //                             location: result.geometry.location,
    //                             photoUrl: null,
    //                             price: null,
    //                             place_id: result.place_id
    //                         }
    //                         if (result.photos) {
    //                             activity.photoUrl = result.photos[0].getUrl();
    //                         }
    //                         if (result.price_level) {
    //                             activity.price = result.price_level;
    //                         }
    //                         return activity
    //                     });

    //                     setGeneratedActivities(organizedActivities);
    //                     // map.setCenter({lat, lng})
    //                     // remove all but the selected marker
    //                 }


    //             } else {
    //                 redoSearch(e, prevActivity, newType, searchRadius)
    //             }
    //         })
    //     }
    // }

    // const redoSearch = (e, prevActivity, newType, searchRadius) => {
    //     if (searchRadius < 10000) {
    //         handleTextSearch(e, prevActivity, newType, searchRadius + 500)
    //     }
    // }

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
    }, [dispatch])

    useEffect(() => {

        if (activities) {
            // setCurrentActivities(activities)

            console.log(activities);

            // centering map at first activity
            // const centerLat = activities.length > 0 ? activities[0].lat : null;
            // const centerLng = activities.length > 0 ? activities[0].lng : null;
            // const newMap = new window.google.maps.Map(mapRef.current, {
            //     center: { lat: lat, lng: lng },
            //     zoom: 15,
            //     // ...mapOptions,
            // });
            // setMap(newMap);

            // creating a bounds encompassing all activities
            const bounds = new window.google.maps.LatLngBounds();
            activities.forEach((activity) => {
                const { lat, lng } = activity;
                const position = new window.google.maps.LatLng(lat, lng);
                bounds.extend(position);
            });
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: bounds.getCenter(),
                zoom: 15,
                // ...mapOptions,
            });
            newMap.fitBounds(bounds);
            setMap(newMap);

            // add markers to map
            activities.forEach(activity => {
                createMarker(newMap, activity);
            });
        }
    }, [activities])


    // if (!itinerary.activities) return <> <h1>Loading...</h1> </> // maybe change this line in future for more robust

    return (
        <>
            <div className='show-title-holder'>
                <div className='show-page-title'>{itinerary.title}</div>
                <div className='show-page-creator'><p>Created by</p>{itinerary.creator}</div>
            </div>

            <div className="flex-row-wrap">
                <div ref={mapRef} className="itinerary-show-map">
                    {/* Map */}
                </div>
                <div className="itinerary-show-details">
                    {activities && !isUpdating && itinerary.activities.map((activity) => {
                        return <ActivityItem activity={activity} key={activity._id} />
                    })}
                    {activities && isUpdating && itinerary.activities.map((activity) => {
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
                {currentUser && currentUser._id === itinerary.creatorId
                    && <div>
                        {isUpdating ? (
                            <button disabled>Updating Itinerary...</button>
                        ) : (
                            <button onClick={handleUpdateItinerary}>Update Itinerary</button>
                        )}
                    </div>}
                {/* <button>Update Itinerary</button> */}
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