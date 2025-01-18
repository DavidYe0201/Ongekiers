import React, { Component } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";

class Navbar extends Component {
    render() {
        return (
            <div>
            <AppBar position="fixed" sx={{ bgcolor: "#43454a" }}>
            <Toolbar>
            <Link to="/">
                <IconButton
                    size="large"
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <img src="/main.png" style={{width: "50px"}} alt=""></img>  
                </IconButton>
            </Link>
                <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                    <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                        Leaderboard
                    </Button>
                </Link>
                <Link to="/scoresimulator" style={{ textDecoration: 'none' }}>
                    <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                        Score Simulator
                    </Button>
                </Link>

            </Toolbar>
        </AppBar>
        <Toolbar />


            </div>
        )
    }
}

export default Navbar;