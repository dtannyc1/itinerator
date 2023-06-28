import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SessionForm.css';
import { signup, clearSessionErrors, login } from '../../store/session';

function SignupForm() {
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

    const handleDemoLogin = e => {
        e.preventDefault();
        e.stopPropagation();
        const user = {
            username: 'DemoUser',
            email: 'demo@app.io',
            password: "password"
        };

        dispatch(login(user));
    }

    return (
        <div className='flex-column-wrap'>
            <div className='form-header'>Sign Up</div>

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
                    <div className={errors?.username ? "form-errors" : "form-errors-space-holder"}>{errors?.username}</div>
                </div>

                <div className='form-input'>
                    <div>Email</div>
                    <input
                        className={errors?.email ? 'input-error' : 'input'}
                        type="text"
                        value={email}
                        onChange={update('email')}
                        placeholder="Email"
                    />
                    <div className={errors?.email ? "form-errors" : "form-errors-space-holder"}>{errors?.email}</div>
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
                    <div className={errors?.password ? "form-errors" : "form-errors-space-holder"}>{errors?.password}</div>
                </div>

                <div className='form-input'>
                    <div>Confirm Password</div>
                    <input
                        className={errors?.password || password !== password2 ? 'input-error' : 'input'}
                        type="password"
                        value={password2}
                        onChange={update('password2')}
                        placeholder="Confirm Password"
                    />
                    <div className={password !== password2 ? "form-errors" : "form-errors-space-holder"}>
                        {password !== password2 && 'Password fields must match'}
                    </div>
                </div>

                <div>
                    <input
                        className='nav-button'
                        id='form-button'
                        type="submit"
                        value="Sign Up"
                        disabled={!email || !username || !password || password !== password2}
                    />

                    <input
                        className='nav-button'
                        id='demo-login-button'
                        type="submit"
                        value="Log in as Demo User"
                        onClick={handleDemoLogin}
                    />
                </div>

            </form>
        </div>
    );
}

export default SignupForm;
