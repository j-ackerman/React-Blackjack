import React from 'react';
import Card from './Card'

const AIHand = props => {
  let { aiCards } = props;
  aiCards = aiCards.slice(1);
    return (
      <div className="dealer">
      <section id="ai-cards" className="cards">{props.total}
        {aiCards.map((card, index) => <Card key={index} card={card} />)}
      </section>
      </div>
    );
}

export default AIHand;
