import React from 'react';
import Card from './Card';

const UserHand = props => {
  const displayNone = { display: 'none' };
  const { handleHit, handleStand, total, userCards } = props;
    return (
      <div className="user">
        <button onClick={handleHit} className="button-hit" id="hit" style={displayNone}>Hit Me</button>&nbsp;
        <button onClick={handleStand} className="button-stand" id="stand" style={displayNone}>Stand</button>
        <br /><br />
      <section id="user-cards" className="cards">{total}
        {userCards.map((card, index) => <Card id={index} key={index} card={card} />)}
      </section>
      </div>
    );
}

export default UserHand;
