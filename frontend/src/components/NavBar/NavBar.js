import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import LoginFormModal from '../SessionForms/LoginFormModal';
import SignupFormModal from '../SessionForms/SignupFormModal';

function NavBar () {
    const loggedIn = useSelector(state => !!state.session.user);
    const dispatch = useDispatch();

    const logoutUser = e => {
        e.preventDefault();
        dispatch(logout());
    }

    const getLinks = () => {
        if (loggedIn) {
            return (
                <div className="links-nav">
                    <button className='nav-button' onClick={logoutUser}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        &nbsp;Logout
                    </button>
                    
                </div>
            );
        } else {
            return (
                <div className="auth-buttons-wrap">
                    <SignupFormModal />
                    <LoginFormModal />
                </div>
            );
        }
    }

    return (
        <>
        <div className='nav-bar'>
            { getLinks() }
        </div>
        </>
    );
}

export default NavBar;
