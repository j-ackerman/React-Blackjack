import React from 'react';
import Card from './Card'

const AIHand = props => {
  let { aiCards } = props;
    return (
      <div className="dealer">
      <section id="ai-cards" className="cards">{props.total}
        {(props.turn === 'user' && props.total !== 21)
          && aiCards.map((card, index) => // During users turn hide 2nd card
          (  index !== aiCards.length - 1 )
          ? <Card key={index} card={card} />
          : <img key={index} className="card dealer-face-down" src="img/card_back.png" />
        )}
        {aiCards.map((card, index) => // During AI/Dealer's turn reveal all cards
            (props.turn === 'ai' || props.total === 21)
          && <Card key={index} card={card} />
        )}
      </section>
      </div>
    );
}

export default AIHand;
