import React, { Component } from 'react';
import AIHand from './AIHand';
import Bet from './Bet';
import Deck from './Deck';
import UserHand from './UserHand';
import { setAICards, setUserCards, fetchDeck, hitUser, hitAI } from '../actions/blackjack_actions';

export default class App extends Component {
  constructor(){
    super();

    this.state = {
      money: 5000,
      bet: 50,
      cardsInHand: 2, // this is not yet implemented, will be used to animate the transition in for the next card when hitting... maybe
      turn: 'user'
    }

    // Bind class methods
    this.calculateAIScore = this.calculateAIScore.bind(this);
    this.calculateUserScore = this.calculateUserScore.bind(this);
    this.changeBet = this.changeBet.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.hitMe = this.hitMe.bind(this);
    this.newGame = this.newGame.bind(this);
    this.stand = this.stand.bind(this);
    this.setWinner = this.setWinner.bind(this);
  }

  calculateUserScore(){
    let aces = false;
    const score = this.props.store.getState().userCards
    .reduce((total, card) => {
        let value = card.value;
        /*
         * ====Account for Aces====
         * - only 1 ace will be used as an 11
         * - check for no aces & total is less than or equal to 10
         *     => if truthy, then ace value is 11 & set aces true
         * - check for aces & total-11 is greater than 10
         *     => if truthy, then minus 10 from total
         */
        if(!aces && value === 1 && total <= 10){
          value = 11;
          aces = true;
        } else if(aces && total-11 > 10){
          total -= 10;
        }
        return total + value;
    } , 0);
    return score;
  }

  calculateAIScore(){
    const score = this.props.store.getState().aiCards
    .reduce((total, card) => {
        return total + card.value;
    } , 0);
    return score;
  }

  changeBet(event){
    let bet = event.target.value;
    if(bet === ''){
      return this.setState({ bet: 0 });
    }
    bet = bet.split('').map(character => {
      if(!isNaN(character)) return character;
    }).join('');
    this.setState({ bet });
  }

  checkWin(){ // TO DO: THIS IS STILL NOT 100% CORRECT, ACCOUNT FOR ALL SCENARIOS
    const aiScore = this.calculateAIScore();
    const { turn } = this.state;
    const userScore = this.calculateUserScore();
    if(this.isBlackjack(userScore) && this.isBlackjack(aiScore)){
        return this.setWinner('Tie', 'Push');
    } else if(this.isBust(aiScore)){
        return this.setWinner('Player','Bust');
    } else if(this.isBlackjack(aiScore)){
        return this.setWinner('Dealer', 'Blackjack');
    } else if(this.isBust(userScore)){
        return this.setWinner('Dealer', 'Bust');
    } else if(this.isBlackjack(userScore)){
        return this.setWinner('Player', 'Blackjack')
    }
    if(aiScore > 16 && turn === 'ai'){
      if(aiScore === userScore){
        return this.setWinner('Tie', 'Push');
      } else if(aiScore > userScore){
        return this.setWinner('Dealer');
      } else if(aiScore < userScore){
        return this.setWinner('Player');
      }
    }
  }

  componentDidMount(){
    this.stackDeck(5);
  }

  componentWillUpdate(){
    //this.checkWin();
  }

  handleBet(){
    var { bet, money } = this.state;
    const { store } = this.props;
    const turn = 'user';
    if(bet >= 2 && bet <= 500 && parseInt(bet)){
      $('#place-bet').hide();
      $('#hit').show();
      $('#stand').show();
      $('.dealer-face-down').show();
      $('#show-bet').show();
      money -= bet;
      store.dispatch(setAICards(store.getState().deck));
      store.dispatch(setUserCards(store.getState().deck));
      this.checkWin(); // check for natural blackjack
      this.setState({ bet, money, turn });
    } else {
      alert('Please enter a value between $2 and $500');
    }
  }

  hitMe(){
    const { store } = this.props;
    // animate card going to user hand
    $('.hit').animate({left: "+=300", bottom: "-=376"}, 300);
    store.dispatch(hitUser(store.getState().deck));
    $('.hit').animate({left: "-=300", bottom: "+=376"}, 0);
    this.checkWin();
  }

  newGame(event){
    const { store } = this.props;
    store.dispatch(fetchDeck());
    //this.shuffle();
    this.stackDeck(5);
    $('#new-game').hide();
    $('#winning-statement').html('');
    $('#place-bet').show();
    $('#show-bet').hide();
    this.setState({
      turn: 'user',
      cardsInHand: 2
    });
  }

  setWinner(winner, winDetails){
    var { money, bet } = this.state;
    if(winner === 'Player'){
      switch(winDetails){
        case 'Blackjack':
          money += ((bet*2) + (bet/2));
          break;
        case 'Push':
          money += bet;
          break;
        default:
          money += (bet*2);
      }
    }
    $('#hit').hide();
    $('#stand').hide();
    $('#new-game').show();
    $('.dealer-face-down').hide();
    this.setState({ turn: 'ai', money })
    if(winner !== 'Tie'){
      $('#winning-statement').html(`${winner} wins!`);
    }
    if(winDetails !== undefined){
      $('#winning-statement').prepend(`${winDetails}! `);
    }
    this.stackDeck(0);
  }

  shuffle(){
    setTimeout(() => {
      return $('.hit').css('z-index', 55).animate({left: "-=30"}, 700);
    }, 5000);
  }

  stackDeck(margin){
    let left = 25;
    let i = 0;
    $('.deck').each(function(){
      $(this).css('z-index', i-100);
      $(this).animate({left: left + 'px'}, 700);
      left = left + margin;
      i++;
    });
  }

  stand(){
    $('#hit').hide();
    $('#stand').hide();
    this.state.turn = 'ai';
    // Automate dealer's (AI) turn
    //hitAI = setInterval(function(){
      //if (SCORE_ < 17) {
      while(this.calculateAIScore() < 17){
        $('.hit').animate({left: "+=300", bottom: "-=30"}, 300);
        this.props.store.dispatch(hitAI(this.props.store.getState().deck));
        $('.hit').animate({left: "-=300", bottom: "+=30"}, 0);
      }
      this.checkWin();
      //} else {
        //clearInterval(hitAI); // Stop the AI from hitting
        //hitAI = null;
      //}
    //}, 1000);
  }

  isBlackjack = (score) => (score === 21) ? true : false;
  isBust = (score) => (score > 21) ? true : false;

  //// TESTING methods

  testBlackjackUser(){
    this.props.store.dispatch(setUserCards([{name:"Ace of Diamonds", value: 1}, {name:"King of Diamonds", value: 10}]));
    this.checkWin();
  }
  testBlackjackAI(){
    this.props.store.dispatch(setAICards([{name:"Ace of Diamonds", value: 1}, {name:"King of Diamonds", value: 10}]));
    this.checkWin();
  }

  testSoft17AI(){
    this.props.store.dispatch(setAICards([{name:"Ace of Diamonds", value: 1}, {name:"Five of Diamonds", value: 5}]));
    this.props.store.dispatch(hitAI([{name:"Ace of Diamonds", value: 1}]));
  }

  testHard17AI(){
    this.props.store.dispatch(setAICards([{name:"King of Diamonds", value: 10}, {name:"Six of Diamonds", value: 6}]));
    this.props.store.dispatch(hitAI([{name:"Ace of Diamonds", value: 1}]));
  }

  render(){
    const { money, bet } = this.state;
    const { aiCards, deck, userCards } = this.props.store.getState();
    return (
    <div className="app">
      <Deck deck={deck} />
      <center>
        <Bet bet={bet} money={money} handleBet={this.handleBet.bind(this)} handleClick={this.changeBet} />
      <br/> <br/>
      <AIHand
        aiCards={aiCards}
        total={this.calculateAIScore()}
        turn={this.state.turn}
      />
      <br />
      <br />
      <button id="new-game" onClick={this.newGame}>New Game</button><br />
        <UserHand
          userCards={userCards}
          total={this.calculateUserScore()}
          handleHit={this.hitMe}
          handleStand={this.stand} />
        <br />
      </center>
      <div id="test-methods">
        <button onClick={this.testBlackjackUser.bind(this)}>Blackjack - User</button><br />
        <button onClick={this.testBlackjackAI.bind(this)}>Blackjack - AI</button><br />
        <button onClick={this.testSoft17AI.bind(this)}>Soft 17 - AI</button>
        <button onClick={this.testHard17AI.bind(this)}>Hard 17 - AI</button>
      </div>
    </div>
    );
  }
}
