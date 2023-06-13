import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './ItineraryMap.css';

const ItineraryMap = ({ mapOptions = {} }) => {

    const [map, setMap] = useState(null);
    const [location, setLocation] = useState('Manhattan');
    const [type, setType] = useState('bar');
    const [number, setNumber] = useState(3);
    const [radius, setRadius] = useState(500); // meters
    const [lat, setLat] = useState(40.736164);
    const [lng, setLng] = useState(-73.993921)

    const mapRef = useRef(null);
    const markers = useRef([]);
    const history = useHistory();

    const [generatedActivities, setGeneratedActivities] = useState([]);

    // Creates the map
    useEffect(() => {
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
            position: place.geometry.location
        });

        let infowindow = new window.google.maps.InfoWindow();

        window.google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map);
        });

        markers.current.push(marker);
    };

    const removeMarkers = () => {
        markers.current.forEach(marker => {
            marker.setMap(null);
            marker.setVisible(false);
        })
        markers.current = [];
    }

    const handleTextSearch = (e) => {
        e.preventDefault();

        removeMarkers();
        // Create PlacesService instance using the map
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            keyword: type,
            location: {lat, lng},
            radius,
        }
        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log(results)

                let activities = [];
                let ii = 0;
                while (activities.length < number && ii < results.length) {
                    if (results[ii].business_status === 'OPERATIONAL'){
                        activities.push(results[ii]);
                    }
                    ii += 1;
                }

                let detailedActivities = [];

                activities.forEach(result => {
                    createMarker(result);

                    const request = {
                        placeId: result.place_id
                    }

                    service.getDetails(request, (results, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            // console.log(results)
                            const activity = {
                                name: results.name,
                                rating: results.rating,
                                streetAddress: results.formatted_address,
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
                            activity.photoURLs = photoURLs;
                            console.log(JSON.stringify(activity))
                            detailedActivities.push(activity);
                        }
                    })
                });

                // let organizedActivities = activities.map((result) => {
                //     const activity = {
                //         name: result.name,
                //         rating: result.rating,
                //         photoUrl: null,
                //         price: result.price_level,
                //     }
                //     if (result.photos) {
                //         activity.photoUrl = result.photos[0].getUrl();
                //     }
                //     return activity
                // });

                setGeneratedActivities(detailedActivities);
                map.setCenter(activities[0].geometry.location)
            }
        })
    }

    return (
        <>
            <div ref={mapRef} className="map">
                Map
            </div>
            <br />
            <div>
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
                <div>
                    {generatedActivities.map((activity, index) => (
                        <div key={index}>
                            <div>Name: {activity.name}</div>
                            <div>Rating: {activity.rating}</div>
                            {activity.photoUrl ? <img src={activity.photoUrl} alt="activity" width="500px"/> : null}
                            <div>Price: {activity.price}</div>
                            <br/>
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
