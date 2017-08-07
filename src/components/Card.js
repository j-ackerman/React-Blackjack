import React from 'react';

const Card = props => {
  return (
    <img className="card" src={cardImage(props.card)} alt={props.card.name}/>
  );
}

export default Card;

function cardImage(card){
  // Convert card.name (e.g. 'Queen of Hearts', 'Two of Clubs')
  // to queen_of_hearts, 2_of_clubs -- this is in order to src
  // the correct filename for the card images that are being
  // used for this application.
  let cardFileName = card.name.toLowerCase().split(' ');
  if(parseInt(convertWrittenNumberToInteger(cardFileName[0]))){ // check if card is #1-10
    cardFileName.splice(0, 1, convertWrittenNumberToInteger(cardFileName[0])); //splice written number for integer
  }
  cardFileName = cardFileName.join(' ').replace(/\s/g, '_'); // replace ' ' with '_'
  // { Name: 'Five of Clubs' } ==> "img/5_of_clubs.png"
  // { Name: 'King of Hearts' } ==> "img/king_of_hearts.png"
  return `img/${cardFileName}.png`;
}


// Convert Written Number to Integer (e.g Two => 2)
function convertWrittenNumberToInteger(writtenNumber){
  switch(writtenNumber){
    case 'one': return 1;
    case 'two': return 2;
    case 'three': return 3;
    case 'four': return 4;
    case 'five': return 5;
    case 'six': return 6;
    case 'seven': return 7;
    case 'eight': return 8;
    case 'nine': return 9;
    case 'ten': return 10;
  }
}
