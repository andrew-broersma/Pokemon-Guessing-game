import React, { Component } from 'react'
import './PokeFetch.css';


class PokeFetch extends Component {
  constructor() {
    super()
    this.state = {
      pokeInfo: '',
      pokeSprite: '',
      pokeName: '',
      time: {}, 
      seconds: 10,
      isZero: false,
    }
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  fetchPokemon() {
    let min = Math.ceil(1);
    let max = Math.floor(152);
    let pokeNum = Math.floor(Math.random() * (max - min) + min);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNum}`, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        this.setState({
          pokeInfo: res,
          pokeSprite: res.sprites.front_default,
          pokeName: res.species.name,
        })
      })
      .catch((err) => console.log(err))
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
}

startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
        this.timer = setInterval(this.countDown, 1000);
        this.setState({
          isZero: false
        })
    }
}

countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
        clearInterval(this.timer);
        this.setState({
          seconds: 11,
          isZero: true
        })
        this.timer = 0

    }
}

componentDidUpdate(prevProps, prevState) {
  if (prevState.seconds === 0){
    this.setState({
      seconds: 10
    })
  }
}

  render() {
    return (
      <div className={'wrapper'}>
        <button className={'start'} onClick={() => (this.fetchPokemon(), this.startTimer())}>Start!</button>
        <h1 className={'timer'} >Time: {this.state.time.s}s</h1>
        <div className={'pokeWrap'}>
          {this.state.isZero ? <img className={'pokeImg'} src={this.state.pokeSprite} /> :
          <img className={'pokeImg2'} src={this.state.pokeSprite} />}
          {this.state.isZero ? <h1 className={'pokeName'}>{this.state.pokeName}</h1> : null}
        </div>
      </div>
    )
  }
}

export default PokeFetch;