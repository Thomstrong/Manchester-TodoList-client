import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <h1>
        Hello, world!
        <App/>
    </h1>,
    document.getElementById('root')
);
registerServiceWorker();
