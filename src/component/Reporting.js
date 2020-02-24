import React, { Component } from "react";
// import { CSVLink, CSVDownload } from "react-csv";
import PropTypes from 'prop-types'
import "../Style.css";
import Header from "./Header";
import Footer from "./Footer";

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      count: 0,
      name: "",
      data: [],
      distinct: [],
      list: false,
      selected: null
    };
  }

  componentDidMount() {
    fetch("https://rp.54gene.com/api/get_participants")
      .then(response => response.json())
      .then(json => this.setState({ posts: json.data }))
      .catch(err => console.log("fetch error:", err));
    this.setState({ distinct: this.state.posts });
  }

  getUnique = array => {
    let uniqueArray = [];

    // Loop through array values
    let c = 0;
    for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }

    return uniqueArray;
  };

  selectParticipantInfo(e) {
    console.log(e.target.value);
    const response = e.target.value;
    let allSelected = [];
    this.state.posts.map((item, i) => {
      Object.entries(item).map(list => {
        allSelected.push(list);
      });
    });
    let x = names => names.filter((v, i) => names.indexOf(v) === i);
    const filterdData = allSelected.filter(dd => {
      if (dd[0] === response) {
        return [dd[0]];
      }
    });
    console.log("sele", allSelected);
    this.setState({
      name: response,
      count: this.state.posts.length,
      distinct: this.getUnique(allSelected),
      data: filterdData,
      list: true,
      selected: response
    });

    console.log("dfdf", filterdData);
  }

  getOccurrence = (array, value) => {
    var count = 0;
    array.forEach(v => v === value && count++);
    return count;
  };

  render() {
    let arr = [];
    let sendCSV = []
    const { posts, data, distinct, selected } = this.state;
    data.map(row => {
      arr.push(row[1]);
    });
    console.log(
      "cds",
      this.getUnique(arr).map(rrr => rrr)
    );
    return (
      <React.Fragment>
        <Header title="Reporting for AfRef Participants"/>
        <div className="container">
          <div className="row" style={{marginTop:60}}>
            <div className="col-md-6" style={{marginTop:20}}>
              <table className="table">
                <tr>
                  <td>
                    <select
                      name="prt"
                      className="form-control"
                      onChange={e => this.selectParticipantInfo(e)}
                    >
                      <option value="">Select Participant Information</option>
                      {this.state.posts.map((list, i) =>
                        Object.entries(list).map(item => {
                          return <option value={item[0]}>{item[0]}</option>;
                        })
                      )}
                    </select>
                  </td>
                </tr>
              </table>
            </div>
         
        {this.state.list ? (
         
              <div className="col-md-6" style={{marginTop:20}}>
                <h2 className="h4 lead text-right">
                  List view for {this.state.name}. Total Count:{" "}
                  <span className="badge"> {this.state.count}</span>
                </h2>
                {/* <div className="num_count badge">{`${this.state.name}(${this.state.count})`}</div> */}
                <ul className="list-group" style={{ height:200, overflow:'auto'}}>
                <li className="list-group-item">
                    <b>Name</b>
                    <span className="badge">
                        Number of Occurence
                    </span>
                </li>
                  {this.getUnique(arr).map(row => {
                    return (
                      <li className="list-group-item">
                        {row}{" "}
                        <span className="badge">
                          {this.getOccurrence(arr, row)}
                        </span>
                      </li>
                    );
                  })}
                  {console.log("cd", this.getUnique(arr))}
                </ul>
                <div style={{}}>
                {/* <CSVDownload data={Object.entries(sendCSV)} target="_blank">
                    <p>Download Excel format</p>
                </CSVDownload> */}
                </div>
              </div>
           
        ) : (
          <div></div>
        )}
        </div></div>
        <Footer />
      </React.Fragment>
    );
  }
}

Reporting.propTypes = {
    title: PropTypes.string,
    posts: PropTypes.array,
    name: PropTypes.string,
    data: PropTypes.array,
    list: PropTypes.bool
}

export default Reporting;
