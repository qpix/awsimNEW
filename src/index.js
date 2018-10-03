import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Terminal from './components/Terminal';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Terminal />, document.getElementById('root'));
registerServiceWorker();
