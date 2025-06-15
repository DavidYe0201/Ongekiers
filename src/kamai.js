import React, { Component } from "react";
import Ongeki from "./ongeki.js";
import OngekiRefresh from "./OngekiRefresh.js";

class Kamai extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
      recents: [],
      error: null,
      userName: null,
      value: null,
      version: "オンゲキ Re:Fresh",
      errorUsername: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleVersion = (urlVersion, type) => {
    // Switch between version strings for use in calling API or formatting in URL
    const versionMap = {
      "1": { formatted: "オンゲキ bright MEMORY Act.1", pretty: "act1" },
      "2": { formatted: "オンゲキ bright MEMORY Act.2", pretty: "act2" },
      "3": { formatted: "オンゲキ bright MEMORY Act.3", pretty: "act3" },
      "4": { formatted: "オンゲキ Re:Fresh", pretty: "refresh" },

    };

    let result = { formatted: "オンゲキ Re:Fresh", pretty: "refresh" };

    Object.keys(versionMap).forEach((key) => {
      if (urlVersion.includes(key)) {
        result = versionMap[key];
      }
    });

    return result[type];
  };

  componentDidMount() {
    if (this.props.params.name && this.props.params.version) {
      // Check URL param /name/version on mount and update state
      let version = this.handleVersion(this.props.params.version, "formatted");
      this.setState(
        { userName: this.props.params.name, version: version },
        () => {
          this.apiCall();
        }
      );
    } else if (this.props.params.name) {
      // For /name only
      this.setState({ userName: this.props.params.name }, () => {
        this.apiCall();
      });
    }
  }

  componentDidUpdate() {
    let versions = ["act1", "act2", "act3", "refresh"]; // Update version param in URL if formatted differently than actx

    if (
      this.props.params.version &&
      !versions.includes(this.props.params.version)
    ) {
      let standardizedVersion = this.handleVersion(
        this.props.params.version,
        "pretty"
      );
      this.props.navigate(`/${this.state.userName}/${standardizedVersion}`, {
        replace: true,
      });
    }
  }

  apiCall = () => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${process.env.REACT_APP_API_KEY}`);
    fetch(
      `https://kamai.tachi.ac/api/v1/users/${this.state.userName}/games/ongeki/Single/pbs/all`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => this.setState({ scores: data }))
      .catch((error) => {
        throw error;
      });

    fetch(
      `https://kamai.tachi.ac/api/v1/users/${this.state.userName}/games/ongeki/Single/scores/recent`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => this.setState({ recents: data }))
      .catch((error) => {
        throw error;
      });
    this.setState({ errorUsername: this.state.userName });
  };

  handleChange = (e) => {
    this.setState({
      userName: e.target.value,
    });
  };

  handleSelectChange = (e) => {
    this.setState({
      version: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      errorUsername: null,
    });
    let standardizedVersion = this.handleVersion(this.state.version, "pretty");
    this.props.navigate(`/${this.state.userName}/${standardizedVersion}`);
  };

  handleBack = (e) => {
    this.setState({
      scores: [],
      recents: [],
      error: null,
      userName: '',
      value: null,
      version: "オンゲキ bright MEMORY Act.3",
      errorUsername: '',
    });
//    this.props.navigate(`/`);
  };

  render() {
    let errorMessage;
    if (
      this.state.scores.length !== 0 &&
      this.state.recents.length !== 0 &&
      this.state.recents !== undefined &&
      this.state.scores !== undefined
    ) {
      if (!this.state.scores?.success && !this.state.scores.recents?.success) {
        errorMessage = `Error, current user does not exist in the database.`;
      } 
      
      if (this.state.version !== "オンゲキ Re:Fresh") {
        return (
          <Ongeki
          scores={this.state.scores}
          handleBack={this.handleBack}
          recents={this.state.recents}
          version={this.state.version}
          userName={this.state.userName}
        ></Ongeki>
        )

      }


      else {
        return (
          <OngekiRefresh
            scores={this.state.scores}
            handleBack={this.handleBack}
            recents={this.state.recents}
            version={this.state.version}
            userName={this.state.userName}
          ></OngekiRefresh>
        );
      }
    }
    return (
      <div>
        <img
        src="https://media1.tenor.com/m/PsVmETQDIHYAAAAd/new-york-ongeki.gif"
        alt="ongekichan"
        >
        </img>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter username:
            <input
              type="text"
              value={this.state.userName == null? '' : this.state.userName}
              onChange={this.handleChange}
            />
          </label>
          <label>
            <select
              value={this.state.version}
              onChange={this.handleSelectChange}
            >
              <option value="オンゲキ Re:Fresh">Refresh</option>
              <option value="オンゲキ bright MEMORY Act.3">Act 3</option>
              <option value="オンゲキ bright MEMORY Act.2">Act 2</option>
              <option value="オンゲキ bright MEMORY Act.1">Act 1</option>
            </select>
          </label>
          <button onClick={this.apiCall} type="submit">
            Submit
          </button>
        </form>
        {errorMessage}
      </div>
    );
  }
}
export default Kamai;
