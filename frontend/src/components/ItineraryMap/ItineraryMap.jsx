import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './ItineraryMap.css';

const ItineraryMap = ({ mapOptions = {} }) => {

    const [map, setMap] = useState(null);
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [number, setNumber] = useState('');
    // const [radius, setRadius] = useState('');

    const mapRef = useRef(null);
    const markers = useRef({});
    const history = useHistory();

    const [generatedActivities, setGeneratedActivities] = useState([]);

    // Creates the map
    useEffect(() => {
        console.log("hi");
        if (!map) {
            setMap(new window.google.maps.Map(mapRef.current, {
                center: {
                    lat: 40.736164,
                    lng: -73.993921
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
    // const handleRadius = (e) => {
    //     setRadius(e.target.value);
    // }

    let infowindow;

    const createMarker = (place) => {
        const marker = new window.google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        infowindow = new window.google.maps.InfoWindow();

        window.google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            // infowindow.open(map);
        });
    };


    const handleTextSearch = (e) => {
        e.preventDefault();

        // Create PlacesService instance using the map
        const service = new window.google.maps.places.PlacesService(map);
        console.log(service);
        const request = {
            query: location,
            type: type,
            // radius: 5000,
        }
        console.log(request);
        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);

                const activities = results.slice(0, number);
                activities.forEach(result => {
                    console.log(result);
                    createMarker(result);
                });


                activities.map((result) => {
                    console.log(result.price_level);
                    const activity = {
                        name: result.name,
                        rating: result.rating,
                        photoUrl: result.photos[0].getUrl()
                        // price: result.price_level,
                    }
                    console.log(activity);
                    return activity
                });

                setGeneratedActivities(activities);


                map.setCenter(results[0].geometry.location)
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
                    {/* <div>
                        Radius
                        <input type="number" value={radius} min={1000} max={10000} step={1000} onChange={handleRadius} />
                    </div> */}
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
                            <div>PhotoUrl: {activity.photoUrl}</div>
                            <img src={activity.photoUrl} alt="activity" />

                            {/* <div>Price: {activity.price}</div> */}
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