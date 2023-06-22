<p align="center">
  <img src="frontend/src/assets/itineratorLogoMain.png" alt="itinerator logo" />
</p>

<p align="center">
  <a target="_blank" href="https://github.com/AntonJames-Sistence"><span style="color: #fccd89; font-weight: bold">itinerator&trade;</span></a>: Curate Your Adventure
</p>

# Table of Contents
* [Background and Overview](#background-and-overview)
* [MVP Features](#mvp-features)
  * [Itinerary Curation: CRUD](#itinerary-curation-create-read-update-destroy)
  * [Google Maps API](#google-maps-api)
    * [Activity Generation by Preferred Type](#generation-by-preferred-type-selection)
    * [Activity Generation by Previous Type](#generation-by-previous-type-selection)
    * [Activity Generation by Map Interaction](#generation-by-map-interaction)
  * [Community Interaction: CRUD](#community-interaction-like--comment-create-read-update-destroy)
* [Future Functionalities](#future-functionalities)
* [Our Team](#our-team)


# Background and Overview

Planning a trip abroad or feeling spontaneous with your friends, but feeling overwhelmed by decision-fatigue? Look no further! <span style="color: #fccd89;">**itinerator&trade;**</span>
 is here to provide you with the perfect solution as your ultimate itinerary planning guide.

<span style="color: #fccd89;">**itinerator&trade;**</span> simplifies the planning process by intelligently curating a diverse range of activities based on any location and a broad list of activity types. Harnessing the power of Google Maps API, <span style="color: #fccd89;">**itinerator&trade;**</span> generates custom recommendations in a number of ways.

Discover hidden gems in your local town or a dream vacation city abroad, pickup a new hobby, connect with like-minded individuals, or immerse yourself in captivating entertainment. With <span style="color: #fccd89;">**itinerator&trade;**</span> and just a few clicks, transform your free time into an opportunity for memorable experiences.

* Languages: JavaScript, HTML5, CSS3
* Frontend: React Redux
* Backend: Node.js (Express.js)
* Database: MongoDB
* External APIs:
    - Google Maps JavasScript API
        - Places Library (Places API)
        - Geocoding Service (Geocoding API)
    - HTML5 Geolocation API
* Hosting: Render

# MVP Features

## Itinerary Curation: <span style="font-size: small;">`CREATE` `READ` `UPDATE` `DESTROY`</span>

Right from the splash, <span style="color: #fccd89;">**itinerator&trade;**</span> users start their personalized journey. 

// gif1 - load splash, type chelsea, nyc, hover over icons, click restaurants

    // setting location to perform nearbySearch on component mount

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

                        setLat(latitude);
                        setLng(longitude);
                    });
                } else {
                    // if geolocation not supported by browser, default to App Academy
                    setLat(40.7271066);
                    setLng(-73.9947448);
                }
            }
        })
    }, [])

Users can select an unlimited amount of activites, name the itinerary, and save it.

// gif2 - select 3 activities, name itinerary, save itinerary

Users can update/destroy their saved itinerary immediately, or from the splash page.

// gif3 - on splash page, scroll down, click on itinerary, make few updates, save, delete.

## Google Maps API

<span style="color: #fccd89;">**itinerator&trade;**</span> utilizes Google Maps API to explore an endless amount of options based on real-time data provided by Google Maps on an interactive and intuitive map interface. Activity recommendations are generated through a combination of 3 methods:

* #### Generation by Preferred Type Selection

Upon clicking a preferred type icon, 3 new activities will be suggested. If <span style="color: #fccd89;">**itinerator&trade;**</span> cannot find 3 suitable activities of preferred type within a 500m radius, it will continue to increment its search radius by 500m until it does before displaying them to the user.

// gif4 - click on preferred type icon (museum)

    const handleTextSearch = (e, prevActivity, newType, searchRadius) => {
        e?.preventDefault();

        if (generatedActivities.length) { removeGeneratedMarkers() }
        generatedMarkers.current = [];

        const service = map ? new window.google.maps.places.PlacesService(map) : null;
        searchRadius = searchRadius || 500;
        const request = {
            keyword: newType ? newType : type,
            location: prevActivity ? { lat: prevActivity.lat, lng: prevActivity.lng } : { lat, lng },
            radius: searchRadius,
        }
        setType(newType || type);

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
                        // expand search radius until enough suggestions are found
                        redoSearch(e, prevActivity, newType, searchRadius)
                    } else {
                        activities.forEach(result => {
                            createGeneratedMarker(result);
                        });

                    ...

    // redo search with increased search radius

    const redoSearch = (e, prevActivity, newType, searchRadius) => {
        if (searchRadius < 10000) {
            handleTextSearch(e, prevActivity, newType, searchRadius + 500)
        }
    }

* #### Generation by Previous Type Selection

Upon selecting a generated activity suggestion, the map automatically centers over that selected activity before automating a new nearbySearch, generating 3 new suggestions based on that activity's type.

// gif5 - click on activity, show 3 newly generated activities

* #### Generation by Map Interaction

Upon dragging the map to a new location, <span style="color: #fccd89;">**itinerator&trade;**</span> dynamically performs a new search, generated 3 new activities.

// gif6 - drag map, show 3 newly generated activities

## Community Interaction (Like & Comment): <span style="font-size: small;">`CREATE` `READ` `UPDATE` `DESTROY`</span>

Upon saving a personalized itinerary, other users will be able to view, like, and comment on the itinerary. These interactive features facilitate meaningful interactions within the community, fostering a sense of connection among <span style="color: #fccd89;">**itinerator&trade;**</span> users.

// gif7 liking itinerary, scrolling down, making comment.

## Future Functionalities

#### User Profiles
* User profile pages will display user information, demographics, contact info, and saved itineraries.

#### Expanded Search Capability
* Users will be able to utilize a search bar during the itinerary creation process to search by any desired keyword.
* Users will have the option to view the next 3 activities if they did not like any of the first set of suggestions.

#### Amazon Web Services (AWS) S3
* Users will be able to share their own photos and videos from the activities on their itineraries.

## Our Team 

<div>
    <img src="frontend/src/assets/itineratorPlaneLow.png" alt="Custom Bullet" width="30" style="vertical-align: middle; margin-right: 10px;"/> 
    Frontend Lead: <a target="_blank" href="https://github.com/AntonJames-Sistence">Anton James</a>
</div>

<div>
<img src="frontend/src/assets/itineratorPlaneLow.png" alt="Custom Bullet" width="30" style="vertical-align: middle; margin-right: 10px;"/> 
    Flex Lead: <a target="_blank" href="https://github.com/bchoi28">Brandon Choi</a>
</div>

<div>
<img src="frontend/src/assets/itineratorPlaneLow.png" alt="Custom Bullet" width="30" style="vertical-align: middle; margin-right: 10px;"/> 
    Backend Lead: <a target="_blank" href="https://github.com/dtannyc1">David Tan</a>
</div>


## Thanks for `READ`ing!

<span style="color: #fccd89;">**itinerator&trade;**</span> was brought to fruition from a 4-day sprint. We hope you enjoy our app, have fun, and safe travels. Bon voyage! 

<br>

<p align="center">
  <img src="frontend/src/assets/itineratorLogoMain.png" alt="itinerator logo"
  width="300" />
</p>
