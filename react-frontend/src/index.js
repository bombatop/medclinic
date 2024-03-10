import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from "react-router-dom";
import { ScreenClassProvider } from 'react-grid-system';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ScreenClassProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ScreenClassProvider>
)
