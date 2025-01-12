import React, { Component } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboardData: [],
            leaderboardArray: []
        };
      }

    apiCall = () => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${process.env.REACT_APP_API_KEY}`)
    fetch(`https://kamai.tachi.ac/api/v1/games/ongeki/Single/leaderboard`,  {headers})
        .then(response => response.json())
        .then(data => this.setState({ leaderboardData: data }))
        .catch(error => {
            throw(error)
        })  
        console.log(this.state.leaderboardData)
    }

    async componentWillMount() {
        this.apiCall()
    }
    
    getUsernameFromUserID = (id) => {
        for (let i = 0; i < 100; i++) {
            if (id == this.state.leaderboardData.body.users[i].id) 
                return this.state.leaderboardData.body.users[i].username
        }
        return "Username doesn't exist"
    }

    generateGrid = () => {
        let newJson = []
        for (let i = 0; i < 100; i++) {
            let username = this.getUsernameFromUserID(this.state.leaderboardData.body.gameStats[i].userID)
            newJson.push([i+1, username, (this.state.leaderboardData.body.gameStats[i].ratings.naiveRating).toFixed(4)])
        }
        return newJson;
    }

    function = (data) => {
        window.open(data[1]);
    }

    render() {   
        let table; 
        if (this.state.leaderboardData.length != 0) {
            table = this.generateGrid()
        }
        return (
          <div>

            <Table aria-label="simple table">
                <TableRow>
                    <TableCell>Ranking</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>NativeRating</TableCell>
                </TableRow>
                
                <TableBody>
                    {
                        table?.map((data, i) => 
                            <TableRow onClick={() => this.function(data)} key={i}>
                                { Object.entries(data).map(([key, val], i) => <TableCell style={{color: "white"}} key={key}>{val}</TableCell >) }
                            </TableRow>   
                        )
                    }
                </TableBody>
            </Table>

          </div>
    
    
        );
      }
}

export default Leaderboard;