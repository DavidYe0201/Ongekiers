import React, { Component } from "react";

class ScoreSimulator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: null,
      critical: 0,
      break: 0,
      hit: 0,
      miss: 0,
      bell: 1,
      totalBell: 1,
      damage: 0,
      score: 0,
      chart: 1,
      score2: 0,
      rating: 0,
      userName: null,
      version: null
    };
  }

  componentDidMount() {
    if (this.props.values !== undefined) {
      this.setState({
        critical: this.props.values[0],
        break: this.props.values[1],
        hit: this.props.values[2],
        miss: this.props.values[3],
        bell: this.props.values[4],
        totalBell: this.props.values[5],
        damage: this.props.values[6],
        chart: this.props.values[7]
      })
    }
  }
  componentDidUpdate() {
    let notePercent =
      this.state.critical * 1 +
      this.state.break * 0.9 +
      this.state.hit * 0.6 +
      this.state.miss * 0;
    let totalNotes =
      this.state.critical * 1 +
      this.state.break * 1 +
      this.state.hit * 1 +
      this.state.miss * 1;
    let acc = notePercent / totalNotes;
    let noteScore = 950000 * acc;
    let bellScore = (this.state.bell / this.state.totalBell) * 60000;
    let damageScore = this.state.damage * 10;
    let totalScore = this.state.score;
    totalScore = noteScore + bellScore - damageScore;

    let musicRate;
    if (this.state.score2 >= 1007500) {
      musicRate = 2;
    } else if (this.state.score2 >= 1000000) {
      musicRate = 1.5 + (this.state.score2 - 1000000) / 15000;
    } else if (this.state.score2 >= 990000) {
      musicRate = 1 + (this.state.score2 - 990000) / 20000;
    } else if (this.state.score2 >= 970000) {
      musicRate = (this.state.score2 - 970000) / 20000;
    } else {
      musicRate = (this.state.score2 - 970000) / 17500;
    }
    musicRate += this.state.chart * 1;
    if (totalScore !== this.state.score && !isNaN(totalScore)) {
      this.setState({ score: totalScore });
    }

    if (musicRate !== this.state.rating) {
      this.setState({ rating: musicRate });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleBack = () => {
    //hacky solution I love react! 
   window.location = `https://ongekiers.netlify.app/${this.props.userName}/${this.props.version}`
  }

  render() {
    const divStyle = {
      display: "grid",
      borderStyle: "solid",
      textAlign: "center",
      padding: "10px",
    };
    let backButton;
    if (this.props.value !== null) {
      backButton = <button onClick={this.handleBack}>Back</button>
    }
    return (
      <div>
        {backButton}
        <form style={divStyle}>
          <label>Critical Break</label>
          <input
            type="number"
            name={"critical"}
            value={this.state.critical}
            onChange={this.handleChange}
          ></input>
          <label>Break</label>
          <input
            type="number"
            name={"break"}
            value={this.state.break}
            onChange={this.handleChange}
          />
          <label>Hit</label>
          <input
            type="number"
            name={"hit"}
            value={this.state.hit}
            onChange={this.handleChange}
          />
          <label>Miss</label>
          <input
            type="number"
            name={"miss"}
            value={this.state.miss}
            onChange={this.handleChange}
          />
          <label>Bell</label>
          <input
            type="number"
            name={"bell"}
            value={this.state.bell}
            onChange={this.handleChange}
          />
          <label>Total Bells</label>
          <input
            type="number"
            name={"totalBell"}
            value={this.state.totalBell}
            onChange={this.handleChange}
          />
          <label>Damage</label>
          <input
            type="number"
            name={"damage"}
            value={this.state.damage}
            onChange={this.handleChange}
          />
        </form>
        Score: {this.state.score.toFixed(2)}
        {"\n"}
        <form style={divStyle}>
          <label>Chart Level</label>
          <input
            type="number"
            name={"chart"}
            value={this.state.chart}
            onChange={this.handleChange}
          />

          <label>Score</label>
          <input
            type="number"
            name={"score2"}
            value={this.state.score2}
            onChange={this.handleChange}
          />
        </form>
        Rating: {this.state.rating.toFixed(2)}
      </div>
    );
  }
}

export default ScoreSimulator;
