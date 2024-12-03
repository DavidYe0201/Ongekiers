import React, { Component } from "react";
import Ongeki from './ongeki.js';
class Kamai extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scores: [],
      recents: [],
      isLoading: true,
      error: null,
      userName: null,
      value: null,
      version: "bright MEMORY Act.3",
      errorUsername: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  apiCall = () => {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${process.env.REACT_APP_API_KEY}`)
      fetch(`https://kamai.tachi.ac/api/v1/users/${this.state.userName}/games/ongeki/Single/pbs/all`,  {headers})
          .then(response => response.json())
          .then(data => this.setState({ scores: data }))
          .catch(error => {
            throw(error)
          })
  
      fetch(`https://kamai.tachi.ac/api/v1/users/${this.state.userName}/games/ongeki/Single/scores/recent`,  {headers})
          .then(response => response.json())
          .then(data => this.setState({ recents: data }))
          .catch(error => {
            throw(error)
          }) 
      this.setState({errorUsername: this.state.userName})
  }

  handleChange = (e) => {
    this.setState({
      userName: e.target.value,
    })
  }  

  handleSelectChange = (e) => {
    this.setState({
      version: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      submitted: true,
      errorUsername: null
    })
  }

  render() {    
    let errorMessage;
      if ((this.state.scores.length !== 0) && (this.state.recents.length !== 0) && (this.state.recents !== undefined) && (this.state.scores !== undefined)) {
        if (!(this.state.scores?.success) && !(this.state.scores.recents?.success)) {
          errorMessage =  `Error, current user does not exist in the database.`
        }
        else {
          return (
            <Ongeki scores={this.state.scores} recents={this.state.recents} version={this.state.version}></Ongeki>
          )
        }
    }
    return (
      <div>
      <form onSubmit={this.handleSubmit}>        
        <label>
          Enter username:
          <input type="text" value={this.state.userName} onChange={this.handleChange} />
        </label>
        <label>
        <select value={this.state.version} onChange={this.handleSelectChange} >
          <option value="bright MEMORY Act.3">Act 3</option>
          <option value="bright MEMORY Act.2">Act 2</option>
          <option value="bright MEMORY Act.1">Act 1</option>
        </select>
        </label>
        <button onClick={this.apiCall} type='submit'>Submit</button>
      </form>
      {errorMessage}
      </div>


    );
  }

}
export default Kamai;