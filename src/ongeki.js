import React, { Component, createRef  } from "react";
import Grid from "@mui/material/Grid2";
import data from "./data.json";
import { toPng } from 'html-to-image';

class Ongeki extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = {
      scores: [],
      recents: [],
      isLoading: true,
      error: null,
      userName: null,
      version: null,
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
    console.log(sortedData);
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

  scoreCreation = (i) => {
    let allJson = this.test();
    if (allJson === null) return null;
    let scores = [];
    scores.push(allJson[3].toFixed(2));
    scores.push(allJson[4].toFixed(2));
    scores.push(allJson[5].toFixed(2));
    scores.push(allJson[6].toFixed(2));
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

  gridCreation = (i) => {
    let allJson = this.test();
    if (allJson === null) return null;
    let json = allJson[i];
    const bestRow = [];
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
          ></div>
          <Grid item xs={12 / 5} style={mystyle}>
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
    para.innerText = "Generated on https://ongekiers.netlify.app/";
    document.getElementById("imageDiv").prepend(para);
    const { current } = this.ref;
    if (current === null) {
      return;
    }
    toPng(current, { cacheBust: true, backgroundColor: "#282c34" })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = this.props.userName + 'OngekiScore' + Date.now() + '.jpeg';
        link.href = dataUrl;
        link.click();
        document.getElementById("imageDiv").removeChild(para);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  render() {
    const apiState = this.props.scores;
    const apiState2 = this.props.recents;
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
            <div>
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
