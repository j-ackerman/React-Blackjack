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
      cardsInHand: 2,
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
    let aces = false;
    const score = this.props.store.getState().aiCards
    .reduce((total, card) => {
        let value = card.value;
        /*
         * ====Account for Aces====
         * - only 1 ace will be used as an 11
         * - check for no aces & total is less than or equal to 10
         *     => if truthy, then ace value is 11 & set aces true
         * - check if AI has soft 17 (AI must hit on a soft 17)
         *     => if truthy, minus 10 from total
         * - check for aces & total-11 is greater than 10
         *     => if truthy, then minus 10 from total
         */
        if(!aces && value === 1 && total <= 10){
          value = 11;
          aces = true;
        } else if(aces && total === 17){
          total -= 10;
        } else if(aces && total-11 > 10){
          total -= 10;
        }
        return total + value;
    } , 0);
    return score;
  }

  changeBet(event){
    const bet = event.target.value;
    if(bet === ''){
      return this.setState({ bet: 0 });
    }
    /*
    $('#bet-custom').on('focus', () => {
      $('#bet-50').removeClass('bet-selected');
    });
    $('.bet').on('click', () => {
      $('#bet' + this.state.bet).addClass('bet-selected');
    });*/
    this.setState({ bet });
  }

  checkWin(){
    const userScore = this.calculateUserScore();
    const aiScore = this.calculateAIScore();
    if(this.isBust(userScore)){
      this.setWinner('Dealer', 'Bust');
    } else if(this.isBlackjack(userScore)){
      this.setWinner('Player1', 'Blackjack')
    }
    if(turn === 'ai'){
      if(this.isBust(aiScore)){
        this.setWinner('Player1','Dealer busts');
      } else if(this.isBlackjack(aiScore)){
        this.setWinner('Dealer', 'Blackjack');
      } else if(aiScore === userScore){
        this.setWinner('Dealer', 'Push');
      } else if(aiScore > userScore){
        this.setWinner('Dealer');
      } else if(aiScore < userScore){
        this.setWinner('Player');
      }
    }
  }

  componentDidMount(){
    this.stackDeck(5);
  }

  handleBet(){
    var { bet, money } = this.state;
    const { store } = this.props;
    if(bet >= 2 && bet <= 500 && parseInt(bet)){
      $('#place-bet').hide();
      $('#hit').show();
      $('#stand').show();
      $('#show-bet').html(`Bet: $${this.state.bet}`);
      money -= bet;
      this.setState({ bet, money });
      store.dispatch(setAICards(store.getState().deck));
      store.dispatch(setUserCards(store.getState().deck));
    } else {
      alert('Please enter a value between $2 and $500');
    }
  }

  hitMe(){
    var { cardsLeft, cardsInHand } = this.state;
    const { store } = this.props;
    // animate
    //$('#' + cardsInHand).fadein(2000);
    $('.hit').animate({left: "+=300", bottom: "-=376"}, 300);
    this.setState({
      cardsInHand: cardsInHand++
    });
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
    this.setState({ turn: 'user' });
  }

  setWinner(winner, winDetails = null){
    $('#hit').hide();
    $('#stand').hide();
    $('#new-game').show();
    let winningStatement = winner !== null && `${winDetails}! `;
    winningStatement += `${winner} wins!`;
    $('#winning-statement').html(winningStatement);
    this.stackDeck(0);
  }

  shuffle(){
    setTimeout(() => {
      return $('.hit').css('z-index', 55).animate({left: "-=30"}, 700);
    }, 5000);
  }

  stackDeck(margin){
    let left = 0;
    let i = 0;
    $('.deck').each(function(){
      $(this).css('z-index', i);
      $(this).animate({left: left + 'px'}, 700);
      left = left + margin;
      i++;
    });
  }

  stand(){
    $('#hit').disabled = true;
    // Automate dealer's (AI) turn
    while(this.calculateAIScore() < 17){
      this.props.store.dispatch(hitAI(this.props.store.getState().deck));
    }
  }

  isBlackjack = (score) => (score === 21) ? true : false;
  isBust = (score) => (score > 21) ? true : false;

  render(){
    const { money, bet } = this.state;
    const { aiCards, deck, userCards } = this.props.store.getState();
    return (
    <div className="app">
      <Deck deck={deck} />
      <center>
        <Bet money={money} handleBet={this.handleBet.bind(this)} handleClick={this.changeBet} />
      <br/> <br/>
      <AIHand
        aiCards={aiCards}
        total={this.calculateAIScore()} />
      <br />
      <section id="show-bet">Bet: ${bet}</section>
      <section id="winning-statement"> </section>
      <br />
      <button id="new-game" onClick={this.newGame}>New Game</button><br />
        <UserHand
          userCards={userCards}
          total={this.calculateUserScore()}
          handleHit={this.hitMe}
          handleStand={this.stand} />
        <br />
      </center>
    </div>
    );
  }
}
