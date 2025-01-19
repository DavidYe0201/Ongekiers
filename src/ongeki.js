import React, { Component, createRef  } from "react";
import Grid from "@mui/material/Grid2";
import data from "./data.json";
import { toPng } from 'html-to-image';
import ScoreSimulator from "./scoresimulator";
class Ongeki extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.getSong = this.getSong.bind(this);
    this.state = {
      scores: [],
      recents: [],
      error: null,
      userName: '',
      version: null,
      recentScore: null,
      values: 0,
      calledScore: false,
      backButton: []
    };
  }

  getImageUrl = (title) => {
    for (let i = 0; i < data.songs.length; i++) {
      if (title === data.songs[i].title) {
        return data.songs[i].imageName;
      }
    }
    return "default.png";
  };
  componentDidMount() {
    if (this.props.scores && this.state.scores === null) {
      this.setState({ scores: this.props.scores });
      this.setState({ recents: this.props.recents });
      this.setState({ version: this.props.version });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.scores !== prevProps.scores && this.state.scores === null) {
      this.setState({ scores: this.props.scores });
      this.setState({ recents: this.props.recents });
      this.setState({ version: this.props.version });
    }
  }

  getJudgetmentData = (data) => {
    let array = []
    Object.keys(data).forEach(function(key) {
      array.push(data[key])
    })
    //crit, break, hit, miss 
    return array
  }

  getBellData = (data) => {
    let array = []
    Object.keys(data).forEach(function(key) {
      array.push(data[key])
    })
    let arr = []
    //bell, total, dmg 
    arr.push(array[2])
    arr.push(array[3])
    arr.push(array[4])
    return arr

  }
  createSongJson = (i, json) => {
    let newEntry = {};
    newEntry.songName = json[i].song.title;
    newEntry.chartRating = json[i].chart.levelNum;
    newEntry.score = json[i].score.scoreData.score;
    newEntry.yourRating = json[i].score.calculatedData.rating;
    newEntry.image = this.getImageUrl(json[i].song.title);
    newEntry.fullBell = json[i].score.scoreData.score.bellLamp;
    newEntry.fullCombo = json[i].score.scoreData.score.noteLamp;
    newEntry.timeStamp = new Date(
      json[i].score.timeAchieved
    ).toLocaleDateString("en-US");
    newEntry.scoreData = this.getJudgetmentData(json[i].score.scoreData.judgements)
    newEntry.bellData = this.getBellData(json[i].score.scoreData.optional)
    return newEntry;
  };

  sortByRating = (data) => {
    return data.sort((a, b) => {
      return b.score.calculatedData.rating - a.score.calculatedData.rating;
    });
  };

  combineRecentJson = (json2) => {
    let json = [json2];
    let combinedJson = [];
    for (let j = 0; j < json[0].body.scores.length; j++) {
      for (let i = 0; i < json[0].body.charts.length; i++) {
        if (json[0].body.charts[i].chartID === json[0].body.scores[j].chartID) {
          combinedJson.push({
            chart: json[0].body.charts[i],
            score: json[0].body.scores[j],
          });
        }
      }
    }
    for (let i = 0; i < combinedJson.length; i++) {
      for (let j = 0; j < json[0].body.songs.length; j++) {
        if (combinedJson[i].score.songID === json[0].body.songs[j].id)
          Object.assign(combinedJson[i], { song: json[0].body.songs[j] });
      }
    }
    const fiftyRecent = combinedJson.slice(0, 30);
    const sortedData = this.sortByRating(fiftyRecent);
    return sortedData;
  };

  combineJson = (json2) => {
    let json = [json2];
    let combinedJson = [];
    for (let j = 0; j < json[0].body.pbs.length; j++) {
      for (let i = 0; i < json[0].body.charts.length; i++) {
        if (json[0].body.charts[i].chartID === json[0].body.pbs[j].chartID) {
          combinedJson.push({
            chart: json[0].body.charts[i],
            score: json[0].body.pbs[j],
          });
        }
      }
    }
    for (let i = 0; i < combinedJson.length; i++) {
      for (let j = 0; j < json[0].body.songs.length; j++) {
        if (combinedJson[i].score.songID === json[0].body.songs[j].id)
          Object.assign(combinedJson[i], { song: json[0].body.songs[j] });
      }
    }
    const sortedData = this.sortByRating(combinedJson);
    return sortedData;
  };
  test = () => {
    if (this.state.scores.length === 0) {
      return null;
    }
    const combinedJson = this.combineJson(this.state.scores);
    let bestArray = [];
    let bestJson = [];
    let latestVersionArray = [];
    let latestJson = [];
    let latestVersion = this.state.version;
    let recentArray = [];
    let recentJson = [];

    let set3 = new Set();
    for (let i = 0; i < combinedJson.length; i++) {
      if (
        combinedJson[i].chart.data.displayVersion === latestVersion &&
        latestJson.length !== 15 &&
        !set3.has(combinedJson[i].score.songID)
      ) {
        set3.add(combinedJson[i].score.songID);
        latestJson.push(this.createSongJson(i, combinedJson));
        latestVersionArray.push(combinedJson[i].score.calculatedData.rating);
      }
    }

    let set4 = new Set();
    for (let i = 0; i < combinedJson.length; i++) {
      if (
        combinedJson[i].chart.data.displayVersion !== latestVersion &&
        bestJson.length !== 30 &&
        !set4.has(combinedJson[i].score.songID)
      ) {
        set4.add(combinedJson[i].score.songID);
        bestJson.push(this.createSongJson(i, combinedJson));
        bestArray.push(combinedJson[i].score.calculatedData.rating);
      }
    }

    const recentDataJson = this.combineRecentJson(this.state.recents);
    let set5 = new Set();
    for (let i = 0; i < recentDataJson.length; i++) {
      if (recentArray.length !== 10) {
        set5.add(recentDataJson[i].score.songID);
        recentJson.push(this.createSongJson(i, recentDataJson));
        recentArray.push(recentDataJson[i].score.calculatedData.rating);
      }
    }

    let bestSum = bestArray.reduce((a, b) => a + b, 0) / 30;
    let latestSum = latestVersionArray.reduce((a, b) => a + b, 0) / 15;
    let recentSum = recentArray.reduce((a, b) => a + b, 0) / 10;
    let totalScore = (bestSum + latestSum + recentSum) / 3;
    const allJson = [];
    allJson.push(bestJson);
    allJson.push(latestJson);
    allJson.push(recentJson);
    allJson.push(bestSum);
    allJson.push(latestSum);
    allJson.push(recentSum);
    allJson.push(totalScore);
    return allJson;
  };

  scoreCreation = () => {

    //test 
    let allJson = this.test();
    if (allJson === null) return null;
    let scores = [];
    scores.push(allJson[3].toFixed(2));
    scores.push(allJson[4].toFixed(2));
    scores.push(allJson[5].toFixed(2));
    scores.push(allJson[6].toFixed(2));
    if (this.state.recentScore === null) {
      this.setState({recentScore: allJson[5].toFixed(2)})

    }
    return scores;
  };

  bestGrid = () => {
    let grid = this.gridCreation(0);
    return grid;
  };

  latestGrid = () => {
    let grid = this.gridCreation(1);
    return grid;
  };

  recentGrid = () => {
    let grid = this.gridCreation(2);
    return grid;
  };


  getSong = (e) => {
    let arr = e[0].concat(e[1])
    let arr2 = arr.concat(e[2])
    console.log("arr2", arr2)
    this.setState({
      values: arr2
    });
    this.setState({calledScore: true})
  }

  gridCreation = (i) => {
    let allJson = this.test();
    if (allJson === null) return null;
    let json = allJson[i];
    const bestRow = [];
    const scoreRow = []
    for (let i = 0; i < json.length; i++) {
      let oneSong = [];
      oneSong.push("Title: ", json[i].songName);
      oneSong.push(<br />);
      oneSong.push("Level: ", json[i].chartRating);
      oneSong.push(<br />);
      oneSong.push("Score: ", json[i].score);
      oneSong.push(<br />);
      oneSong.push("Rating: ", json[i].yourRating);
      oneSong.push(<br />);
      oneSong.push(json[i].timeStamp);
      oneSong.push(<br />);
      oneSong.push(json[i].fullBell);
      oneSong.push(<br />);
      oneSong.push(json[i].fullCombo);
      oneSong.push(<br />);

      bestRow.push(oneSong);
      let scoreSong = []
      scoreSong.push(json[i].scoreData)
      scoreSong.push(json[i].bellData)
      scoreSong.push(json[i].chartRating)
      scoreRow.push(scoreSong)
    }

    
    const gridRow = [];
    const mystyle = {
      border: "solid",
      height: "150px",
      width: "100px",
      fontSize: "12px",
      color: "#fff",
      textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000",
      float: "right",
    };

    const divStyle = {
      height: "150px",
      width: "250px",
      display: "flex",
    };

    
    for (let i = 0; i < bestRow.length; i++) {
      gridRow.push(
        <div style={divStyle}>
          <div
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/img/cover-m/${json[i].image})`,
              backgroundSize: "contain",
              height: "150px",
              width: "150px",
              float: "left",
            }}
            onClick={() => this.getSong(scoreRow[i])}
          ></div>
          <Grid item xs={12 / 5} style={mystyle} >
            {bestRow[i]}
          </Grid>
        </div>

      );
    }
    return gridRow;
  };

  handleSelectChange = (e) => {
    this.setState({
      version: e.target.value,
    });
  };

  onButtonClick = () => {
    const para = document.createElement("p");
    const para2 = document.createElement("p");
    const para3 = document.createElement("p");

    para.style.cssText = "font-size:15px;text-align:left"
    para2.style.cssText = "font-size:15px;text-align:left"
    para.innerText = "Generated on https://ongekiers.netlify.app/";
    para2.innerText = "I'm ngl I have no idea how to calculate the recent score so it's not in the image but my calculated score is " + this.state.recentScore
    para3.innerText = this.props.userName
    document.getElementById("imageDiv").prepend(para2);
    document.getElementById("imageDiv").prepend(para);
    document.getElementById("imageDiv").prepend(para3);

    const { current } = this.ref;
    if (current === null) {
      return;
    }
    toPng(current, {  backgroundColor: "#282c34" })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = this.props.userName + 'OngekiScore' + Date.now() + '.jpeg';
        link.href = dataUrl;
        link.click();
        document.getElementById("imageDiv").removeChild(para);
        document.getElementById("imageDiv").removeChild(para2);
        document.getElementById("imageDiv").removeChild(para3);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  render() {
    const apiState = this.props.scores;
    const apiState2 = this.props.recents;
    if (this.state.calledScore) {
      return (
        <ScoreSimulator
          values={this.state.values}
          userName={this.props.userName}
          version={this.props.version}
        >
        </ScoreSimulator>
      )
    }
    if (apiState.length === 0 || apiState2.length === 0) {
      return <p>Loading...</p>;
    } else {
      let best = this.bestGrid();
      let latest = this.latestGrid();
      let recent = this.recentGrid();
      let scores = this.scoreCreation();
      if (
        best === null ||
        latest === null ||
        recent === null ||
        scores === null
      ) {
        this.setState({ scores: this.props.scores });
        this.setState({ recents: this.props.recents });
        this.setState({ version: this.props.version });
        return <p>Scores are loading...</p>;
      }

            
      return (
        <div style={{ width: "70%"}} >
            <div >
                <label>
                <select
                value={this.state.version}
                onChange={this.handleSelectChange}
                >
                <option value="bright MEMORY Act.3">Act 3</option>
                <option value="bright MEMORY Act.2">Act 2</option>
                <option value="bright MEMORY Act.1">Act 1</option>
                </select>
            </label>
            <button style={{margin: "1%"}} onClick={this.onButtonClick}> Save as Image </button>
            </div>


        <div id="imageDiv" ref={this.ref} style={{padding: "5px"}}>
        <p>Total: {scores[3]}</p>
          <p style={{ textAlign: "left" }}>Best: {scores[0]}</p>
          <Grid container spacing={2}>
            {best}
          </Grid>
          <p style={{ textAlign: "left" }}>Latest: {scores[1]}</p>
          <Grid container spacing={2}>
            {latest}
          </Grid>

        </div>
          <p style={{ textAlign: "left" }}>Recent: {scores[2]}</p>
          <Grid container spacing={2}>
            {recent}
          </Grid>
        </div>
      );
    }


  }
}

export default Ongeki;