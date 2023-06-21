import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/store';

import { ModalProvider } from './components/context/Modal';

// import jwtFetch from './store/jwt';
// import { createComment, deleteComment, updateComment } from './store/comments';
// import { createLike, deleteLike } from './store/likes';


let store = configureStore({});

// window.jwtFetch = jwtFetch;
// window.createComment = createComment;
// window.updateComment = updateComment;
// window.deleteComment = deleteComment;
// window.createLike = createLike;
// window.deleteLike = deleteLike;
// window.store = store;

function Root() {
    return (
        <ModalProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </ModalProvider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById('root')
);
