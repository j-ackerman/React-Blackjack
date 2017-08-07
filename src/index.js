/*====================================================================
    Blackjack with React.js, Redux, & jQuery, by J. Ackerman (2017)
 ====================================================================*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { createStore } from 'redux';
import blackjackReducer from './reducers/blackjack_reducer';
import { fetchDeck } from './actions/blackjack_actions';

const store = createStore(blackjackReducer);

const render = function(){
  ReactDOM.render(<App store={store} />, document.getElementById('container'));
}

store.subscribe(render);
store.dispatch(fetchDeck());
