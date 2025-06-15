import React, { Component } from "react";
import "./App.css";

class ScoreSimulatorV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: null,
      chartRating: 0,
      score: 0,
      technicalRankBonus: null,
      clearBadge: null, 
      fullBell: false,
      platinumScore: 0,
      baseRating: 0,
      platinumRating: 0
    };
  }  // TODO: Inputs don't handle non-numbers well

  // componentDidMount() {
  //   if (this.props.values !== undefined) {
  //     this.setState({
  //       critical: this.props.values[0],
  //       break: this.props.values[1],
  //       hit: this.props.values[2],
  //       miss: this.props.values[3],
  //       bell: this.props.values[4],
  //       totalBell: this.props.values[5],
  //       damage: this.props.values[6],
  //       chart: this.props.values[7],
  //       score2: this.props.values[8]
  //   })
  //   }
  // }

  calculateTechnicalScoreBonus(score) {
    let bonus;
    if (score >= 1010000) {
      bonus = 2
    } else if (score >= 1007500) {
      bonus = 1.75 + (2 - 1.75) * (score - 1007500) / (1010000 - 1007500)
    } else if (score >= 1000000) {
      bonus = 1.25 + (1.75 - 1.25) * (score - 1000000) / (1007500 - 1000000)
    } else if (score >= 990000) {
      bonus = 0.75 + (1.25 - 0.75) * (score - 990000) / (1000000 - 990000)
    } else if (score >= 970000) {
      bonus = 0 + (0.75 - 0) * (score - 970000) / (990000 - 970000)
    } else if (score >= 900000) {
      bonus = -4 + (0 - -4) * (score - 900000) / (970000 - 900000) // TODO: Double check linear interpolation for negative nums here
    } else if (score >= 800000) {
      bonus = -6 + (-4 - -6) * (score - 800000) / (900000 - 800000) 
    } else {
      bonus = 0
    }
    return bonus
  }

  mapTechnicalRankBonus(technicalRankBonus) {
    let bonus = 0;
    if (technicalRankBonus === "SSS+"){
      bonus = 0.3
    } else if (technicalRankBonus === "SSS"){
      bonus = 0.2
    } else if (technicalRankBonus === "SS"){
      bonus = 0.1
    }
    return bonus
  }

  mapClearBadgeBonus(clearBadge) {
    let bonus = 0;
    if (clearBadge === "All Break+"){
      bonus = 0.35
    } else if (clearBadge === "All Break"){
      bonus = 0.3
    } else if (clearBadge === "Full Combo"){
      bonus = 0.1
    }
    return bonus
  }

  mapPlatinumScore(platinumScore, chartRating) {
    let platinumBonus = 0;
    if (platinumScore >= 0.98){
      platinumBonus = 5
    } else if (platinumScore >= 0.97){
      platinumBonus = 4
    } else if (platinumScore >= 0.96){
      platinumBonus = 3
    } else if (platinumScore >= 0.95){
      platinumBonus = 2
    } else if (platinumScore >= 0.94){
      platinumBonus = 1
    }

    return platinumBonus * chartRating * chartRating / 1000 // Platinum rating
  }
  
  componentDidUpdate() {
    let baseRating = 0;
    let fullBell = 0;

    if (this.state.fullBell){
      fullBell = 0.05
    }

    if (this.state.score > 800000){
      baseRating = (parseFloat(this.state.chartRating) + this.calculateTechnicalScoreBonus(this.state.score) + this.mapTechnicalRankBonus(this.state.technicalRankBonus) + 
      this.mapClearBadgeBonus(this.state.clearBadge) + fullBell) / 5 // TODO: Where does 5 come from in the blog example?
    } else if (this.state.score > 500000) {
      baseRating = (this.state.chartRating - 6) * (this.state.score - 500000) / 300000
    } else {
      baseRating = 0
    }

    let platinumRating = this.mapPlatinumScore(this.state.platinumScore, this.state.chartRating)

    if (baseRating !== this.state.baseRating && !isNaN(baseRating)) {
      this.setState({ baseRating: baseRating });
    }
    if (platinumRating !== this.state.platinumRating && !isNaN(platinumRating)) {
      this.setState({ platinumRating: platinumRating });
    }

    let technicalRank;
    if (this.state.score != null) {
      if (this.state.score >= 1007500)
        technicalRank = "SSS+"
      else if ((this.state.score < 1007500) && (this.state.score >= 1000000))
        technicalRank = "SSS"
      else if ((this.state.score < 1000000) && (this.state.score >= 990000))
        technicalRank = "SS"

      }
    
      if ((technicalRank !== null) && (this.state.technicalRankBonus !== technicalRank)) {
        this.setState(() => ({
          technicalRankBonus: this.state.technicalRankBonus === technicalRank ? null : technicalRank
        }));      
      }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClearRadio = (e) => {
    const value = e.target.value;
    this.setState(() => ({
      clearBadge: this.state.clearBadge === value ? null : value
    }));
  }

  handleCheckbox = (e) => {
    this.setState({ fullBell: !this.state.fullBell });
  }

  handleBack = () => {
    //hacky solution I love react! 
   window.location = `https://ongekiers.netlify.app/${this.props.userName}/${this.props.version}`
  }

  // handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //           const jsonString = e.target.result;
  //           const jsonData = JSON.parse(jsonString);
  //           // Handle the jsonData here
  //           console.log(jsonData);
  //       } catch (error) {
  //         console.error("Error parsing JSON:", error);
  //       }
  
  //     };
  //     reader.readAsText(file);
  //   }
  // };

  render() {
    const divStyle = {
      display: "grid",
      borderStyle: "solid",
      textAlign: "center",
      padding: "10px",
    };

    let { clearBadge } = this.state;

    return ( 
      <div>
        <div>
          <form style={divStyle}>
            <label>Chart Rating</label>
              <input
                type="number"
                name={"chartRating"}
                value={this.state.chartRating}
                onChange={this.handleChange}
              />

            <label>Score</label>
              <input
                type="number"
                name={"score"}
                value={this.state.score}
                onChange={this.handleChange}
              />

            <div className="vertical-radio-buttons">
              Clear Badge
              <label>
                All Break+
                <input type="radio" name="clearBadge" value="All Break+" checked={clearBadge === "All Break+"} onClick={this.handleClearRadio} readOnly/>
              </label>

              <label>
                All Break
                <input type="radio" name="clearBadge" value="All Break" checked={clearBadge === "All Break"} onClick={this.handleClearRadio} readOnly/>
              </label>

              <label>
                Full Combo
                <input type="radio" name="clearBadge" value="Full Combo" checked={clearBadge === "Full Combo"} onClick={this.handleClearRadio} readOnly/>
              </label>

              Full Bell
              <input type="checkbox" name="fullBell" onChange={this.handleCheckbox} checked={this.state.fullBell}/>
            </div>

          </form>
          
          {/* <input type="file" accept=".json" onChange={this.handleFileChange} /> */}
        </div>
        
        <div>
        Base Rating: {this.state.baseRating.toFixed(2)}
        </div>
        
        <form style={divStyle}>
        
          <label>Platinum Score</label>
            <input
              type="number"
              name={"platinumScore"}
              value={this.state.platinumScore}
              onChange={this.handleChange}
            />
        </form>
        Platinum Rating: {this.state.platinumRating.toFixed(2)}
      </div>
    )
}
}

export default ScoreSimulatorV2;
