import React, {Component} from 'react';
import data from './data.json';
import json from './jsonData.json'
import Grid from '@mui/material/Grid2';

//todos: picking ver (latestVersion), api call, images as background 
class Ongeki extends Component {
    getImageUrl = (title) => {
        for (let i = 0; i < data.songs.length; i++) {
            if (title === data.songs[i].title) {
                return data.songs[i].imageName;
            }
    
        }
        return "default.png";
    }

    createSongJson = (i) => {
        let newEntry = new Object() 
        newEntry.songName = json[i].__related.song.title
        newEntry.chartRating = json[i].__related.chart.levelNum
        newEntry.score = json[i].scoreData.score
        newEntry.yourRating = json[i].calculatedData.rating
        //newEntry.image = getImageUrl(json[i].__related.song.title)
        newEntry.fullBell = ("FULL BELL" == json[i].scoreData.bellLamp) ? "FULL BELL" : ""
        newEntry.fullCombo = ("FULL COMBO" == json[i].scoreData.noteLamp) ? "FULL COMBO" : ""
        return newEntry;
    }

    //make this have 3 arrays [bestJson, latestJson, recentJson]
    test = () => {
        let bestArray = []
        let bestJson = []

        let latestVersionArray = []
        let latestJson = []
        let latestVersion = "bright MEMORY Act.3"
        let recentArray = []
        let recentJson = []
        for (let i = 0; i < json.length; i++) {
            if (json[i].__related.chart.data.displayVersion == latestVersion) {
                if (latestVersionArray.length == 15) {
                    let smolestNumber = Math.min(...latestVersionArray)
                    if (json[i].calculatedData.rating > smolestNumber) {
                        latestVersionArray[latestVersionArray.indexOf(smolestNumber)] = json[i].calculatedData.rating
                        latestJson = latestJson.filter(value => value.yourRating != smolestNumber)
                        latestJson.push(this.createSongJson(i))
                    }
                }
                else {
                    latestVersionArray.push(json[i].calculatedData.rating)
                    latestJson.push(this.createSongJson(i))
                }
            }
            else if (bestArray.length == 30) {
                let smolestNumber = Math.min(...bestArray)
                if (json[i].calculatedData.rating > smolestNumber) {
                    bestArray[bestArray.indexOf(smolestNumber)] = json[i].calculatedData.rating
                    bestJson = bestJson.filter(value => value.yourRating != smolestNumber)
                    bestJson.push(this.createSongJson(i))
                }
            }
            else {
                bestArray.push(json[i].calculatedData.rating)
                bestJson.push(this.createSongJson(i))
            }
        }

        for (let i = 0; i < 30; i++) {
            if (recentArray.length == 10) {
                let smolestNumber = Math.min(...recentArray)
                if (json[json.length - i - 1].calculatedData.rating > smolestNumber) {
                    recentArray[recentArray.indexOf(smolestNumber)] = json[json.length - i - 1].calculatedData.rating
                    recentJson = recentJson.filter(value => value.yourRating != smolestNumber)
                    recentJson.push(this.createSongJson(json.length - i - 1))
                }
            }
            else {
                recentArray.push(json[json.length - i - 1].calculatedData.rating)
                recentJson.push(this.createSongJson(json.length - i - 1))
            }
        }
        let bestSum = (bestArray.reduce((a, b) => a + b, 0))/30
        let latestSum = (latestVersionArray.reduce((a, b) => a + b, 0))/15
        let recentSum = (recentArray.reduce((a, b) => a + b, 0))/10
        let totalScore = (bestSum + latestSum + recentSum)/3
        const allJson = []
        allJson.push(bestJson)
        allJson.push(latestJson)
        allJson.push(recentJson)
        allJson.push(bestSum)
        allJson.push(latestSum)
        allJson.push(recentSum)
        allJson.push(totalScore)
        return allJson;
    }

    scoreCreation = (i) => {
        let allJson = this.test();
        let scores = []
        scores.push(allJson[3].toFixed(2));
        scores.push(allJson[4].toFixed(2));
        scores.push(allJson[5].toFixed(2));
        scores.push(allJson[6].toFixed(2));
        return scores
    }

    bestGrid = () => {
        let grid = this.gridCreation(0) 
        return grid;
    }

    latestGrid = () => {
        let grid = this.gridCreation(1) 
        return grid;
    }

    recentGrid = () => {
        let grid = this.gridCreation(2) 
        return grid;
    }

    gridCreation = (i) => {
        let allJson = this.test()
        let json = allJson[i]
        const bestRow = []
        for (let i = 0; i < json.length; i++) {
            let oneSong = []
            oneSong.push(json[i].songName)
            oneSong.push(<br/>)
            oneSong.push(json[i].chartRating)
            oneSong.push(<br/>)
            oneSong.push(json[i].score)
            oneSong.push(<br/>)
            oneSong.push(json[i].yourRating)
            oneSong.push(<br/>)
            oneSong.push(json[i].fullBell)
            oneSong.push(<br/>)
            oneSong.push(json[i].fullCombo)
            oneSong.push(<br/>)
            bestRow.push(oneSong)
        }
        const gridRow = []
        const mystyle = {
            border: "solid",
            height: "150px",
            width: "150px",
            fontSize: "14px",
          };
        for (let i = 0; i < bestRow.length; i++) {
            gridRow.push(<Grid item xs={12/5} style={mystyle}>
                    {bestRow[i]}
                </Grid>)
        }
        return gridRow
    }

    
    
    render() {
        let best = this.bestGrid();
        let latest = this.latestGrid();
        let recent = this.recentGrid()
        let scores = this.scoreCreation()
        return (
            <div style={{width: 900}}>
                <p>Total: {scores[3]}</p>
                <p style={{textAlign: "left"}}>Best: {scores[0]}</p>
                        <Grid container spacing={2}>
                            {best}
                        </Grid>
                <p style={{textAlign: "left"}}>Latest: {scores[1]}</p>
                <Grid container spacing={2}>
                            {latest}
                </Grid>
                <p style={{textAlign: "left"}}>Recent: {scores[2]}</p>
                <Grid container spacing={2}>
                            {recent}
                </Grid>
            </div>

            

        )
    }
}

export default Ongeki;
