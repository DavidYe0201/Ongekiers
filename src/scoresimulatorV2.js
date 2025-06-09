import React, { Component } from "react";
import "./App.css";

class ScoreSimulatorV2 extends Component {
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
      version: null,
      score2Once: false
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
        chart: this.props.values[7],
        score2: this.props.values[8]
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

    if ((musicRate !== this.state.rating) && !isNaN(musicRate)) {
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

    handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
            const jsonString = e.target.result;
            const jsonData = JSON.parse(jsonString);
            // Handle the jsonData here
            console.log(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
  
      };
      reader.readAsText(file);
    }
  };

  render() {

    return( 
        <div className="divStyle">
        <form>
        <label>Chart Rating</label>

          <input
            type="number"
            name={"critical"}
            value={this.state.critical}
            onChange={this.handleChange}
          ></input>

        <label>Score</label>
          <input
            type="number"
            name={"critical"}
            value={this.state.critical}
            onChange={this.handleChange}
          ></input>



        <div className="vertical-radio-buttons">
            Technical Rank Bonus
            <label>
                SSS+
                <input type="radio" name="choice" value="A" />
            </label>
            <label>
                SSS
                <input type="radio" name="choice" value="B" /> 
            </label>
            <label>
                SS
                <input type="radio" name="choice" value="C" />
            </label>
            </div>



        <div className="vertical-radio-buttons">
        Clear Badge

        <label>
        All Break+
        <input
          id="windows"
          value="All Break+"
          name="platform"
          type="radio"
          onChange={this.handleChange}
        />
        </label>

        <label>

        All Break
        <input
          id="mac"
          value="All Break"
          name="platform"
          type="radio"
          onChange={this.handleChange}
        />
                </label>

                <label>

        Full Combo
        <input
          id="linux"
          value="Full Combo"
          name="platform"
          type="radio"
          onChange={this.handleChange}
        />
        </label>

        Full Bell
        <input
            type="checkbox"
        />
        </div>

        <label>Platinum Score</label>
          <input
            type="number"
            name={"critical"}
            value={this.state.critical}
            onChange={this.handleChange}
          ></input>



        </form>

<button>Get Rating</button>

<input type="file" accept=".json" onChange={this.handleFileChange} />
       </div>
    )
}
}

export default ScoreSimulatorV2;
