export function fetchDeck(){
  return {
    type: 'FETCH_DECK'
  };
}

export function setUserCards(deck){
  const type = 'DEAL_USER_CARDS';
  const cards = dealCards(deck);
  return { type, cards };
}

export function setAICards(deck){
  const type = 'DEAL_AI_CARDS';
  const cards = dealCards(deck);
  return { type, cards };
}

export function hitUser(deck){
  const type = 'HIT_USER';
  const card = getRandomCard(deck);
  return { type, card };
}

export function hitAI(deck){
  const type = 'HIT_AI';
  const card = getRandomCard(deck);
  return { type, card };
}

function getRandomCard(deck){
  const randomize = Math.floor(Math.random() * deck.length);
  return deck[randomize];
}

function dealCards(deck){
  let cards = [];
  do { cards = [getRandomCard(deck), getRandomCard(deck)]; }
  while(cards[0] === cards[1]); //check for duplicates
  return cards;
}
