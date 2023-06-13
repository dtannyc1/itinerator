import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SessionForm.css';
import { signup, clearSessionErrors } from '../../store/session';

function SignupForm () {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = field => {
        let setState;

        switch (field) {
            case 'email':
                setState = setEmail;
                break;
            case 'username':
                setState = setUsername;
                break;
            case 'password':
                setState = setPassword;
                break;
            case 'password2':
                setState = setPassword2;
                break;
            default:
                throw Error('Unknown field in Signup Form');
        }

        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            email,
            username,
            password
        };

        dispatch(signup(user));
    }

    return (
        <div className='flex-column-wrap'>
            <div className='form-header'>Sign Up Form</div>

            <form className="session-form" id='signup-form' onSubmit={handleSubmit}>

                <div className='form-input'>
                    <div>Username</div>
                    <input
                        className={errors?.username ? 'input-error' : 'input'}
                        type="text"
                        value={username}
                        onChange={update('username')}
                        placeholder="Username"
                    />
                </div>
                    <div className="form-errors">{errors?.username}</div>

                <div className='form-input'>
                    <div>Email</div>
                    <input
                        className={errors?.email ? 'input-error' : 'input'}
                        type="text"
                        value={email}
                        onChange={update('email')}
                        placeholder="Email"
                    />
                    <div className="form-errors">{errors?.email}</div>
                </div>

                <div className='form-input'>
                    <div>Password</div>
                    <input
                        className={errors?.password || password !== password2 ? 'input-error' : 'input'}
                        type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                    />
                </div>
                    <div className="form-errors">{errors?.password}</div>

                <div className='form-input'>
                    <div>Confirm Password</div>
                    <input
                        className={errors?.password || password !== password2 ? 'input-error' : 'input'}
                        type="password"
                        value={password2}
                        onChange={update('password2')}
                        placeholder="Confirm Password"
                    />
                    <div className="form-errors">
                        {password !== password2 && 'Password fields must match'}
                    </div>
                </div>

                <input
                    className='nav-button'
                    id='form-button'
                    type="submit"
                    value="Sign Up"
                    disabled={!email || !username || !password || password !== password2}
                />

            </form>
        </div>
    );
}

export default SignupForm;
