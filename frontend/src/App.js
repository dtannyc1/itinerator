import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import ItineraryCreatePage from './components/ItineraryCreatePage/ItineraryCreatePage';

import { getCurrentUser } from './store/session';
import { Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import ItineraryShowPage from './components/ItineraryShawPage/ItineraryShowPage';

function App() {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser()).then(() => setLoaded(true));
    }, [dispatch]);

    return loaded && (
        <>
            <NavBar />

            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route exact path="/itineraries/:itineraryId" component={ItineraryShowPage} />
                <Route exact path="/itinerary" component={ItineraryCreatePage} />
            </Switch>

            <Footer />
        </>
    );
}

export default App;
