import React from 'react';

const Deck = props => {
  const displayDeck = props.deck.map((card, index) => {// index offset so no duplicate id's
    if(index < 15){
      return (<img key={index} className="deck card" src="img/card_back.png" alt={card.name} />);
    }
  });
  return (
    <div>
      {displayDeck}
      <img className="deck card hit" src="img/card_back.png" />
    </div>
  );
}

export default Deck;
