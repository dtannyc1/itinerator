import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SessionForm.css';

import { login, clearSessionErrors } from '../../store/session';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'email' ? setEmail : setPassword;
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    }

    return (
        <div className='flex-column-wrap'>
            <div className='form-header'>Log In</div>

            <form className="session-form" onSubmit={handleSubmit}>

                <div className='form-input'>
                    <div>Username / Email</div>
                    <input
                        className={errors?.password ? 'input-error' : 'input'}
                        type="text"
                        value={email}
                        onChange={update('email')}
                        placeholder="Username or Email"
                    />
                    <div className="form-errors">{errors?.email}</div>
                </div>

                <div className='form-input'>
                    <div>Password</div>
                    <input
                        className={errors?.password ? 'input-error' : 'input'}
                        type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                    />
                    <div className="form-errors">{errors?.password}</div>
                </div>

                <input
                    className='nav-button'
                    id='form-button'
                    type="submit"
                    value="Log In"
                    disabled={!email || !password}
                />
            </form>
        </div>
    );
}

export default LoginForm;
