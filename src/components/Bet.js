import React from 'react';

const Bet = (props) => {
  return (
  <div>
  <section id ="money">${props.money}</section>
  <section id="place-bet">
    <button onClick={props.handleClick} id="bet-50" className="bet" value="50">$50</button>
    <button onClick={props.handleClick} id="bet-100" className="bet" value="100">$100</button>
    <button onClick={props.handleClick} id="bet-200" className="bet" value="200">$200</button>
    $<input type="text"
            id="bet-custom"
            onChange={props.handleClick}
            placeholder="$" />
    <button id="btn-bet" onClick={props.handleBet}>Bet</button>
  </section>
</div>
  );
}

export default Bet;
