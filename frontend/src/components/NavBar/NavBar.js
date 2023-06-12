import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';

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
                    <Link className='nav-button' to={'/signup'}>
                        <i className="fa-solid fa-user-plus"></i>
                        &nbsp;Signup
                        </Link>
                    <Link className='nav-button' to={'/login'}>
                        <i className="fa-solid fa-user-large"></i>
                        &nbsp;Login
                        </Link>
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
