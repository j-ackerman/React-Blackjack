import React from 'react';

const Bet = (props) => {
  return (
  <div>
  <section id="show-bet" className="black-box bet-box">Bet: ${props.bet}</section>
  <section id="winning-statement"> </section>
  <section id="money" className="black-box money-box"><font className="money-text">${props.money}</font></section>
  <section id="place-bet" className="black-box bet-box">
    <font className="bet-text">Bet: $</font><input type="text"
            id="bet-custom"
            onChange={props.handleClick}
            placeholder="$"
            value={props.bet}
    />
    <button id="bet" className="btn-bet" onClick={props.handleBet}>Bet</button><br />
    <button onClick={props.handleClick} id="bet-50" className="bet btn-bet" value="50">$50</button>
    <button onClick={props.handleClick} id="bet-100" className="bet btn-bet" value="100">$100</button>
    <button onClick={props.handleClick} id="bet-200" className="bet btn-bet" value="200">$200</button>
  </section>
</div>
  );
}

export default Bet;
