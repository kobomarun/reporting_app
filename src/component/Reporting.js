import React, { Component } from "react";
// import { CSVLink, CSVDownload } from "react-csv";
import CsvDownload from 'react-json-to-csv';
import PropTypes from 'prop-types'
import "../Style.css";
import Header from "./Header";
import Footer from "./Footer";
var md5 = require('md5');


class Reporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [],
      count: 0,
      name: "",
      data: [],
      distinct: [],
      list: false,
      selected: null,
      checkdob: false,
      genderSelected: null,
      genderCount: 0,
      from:0,
      too:0
    };
  }

  componentDidMount() {
    fetch("https://rp.54gene.com/api/getResponse/1/1")
      .then(response => response.json())
      .then(json => this.setState({responses:json.data}))
      .catch(err => console.log("fetch error:", err))
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
    this.state.responses.map((item, i) => {
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
      count: this.state.responses.length,
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

  advanceSearch = () => {
    const value  = 'bmi'
    const { from, too } = this.state;
    if(value == 'bmi') {
      this.setState({ checkdob: false})
      const bmi = value;
     const filter = this.state.responses.filter(list => {
        if(list.gender == this.state.genderSelected && list.bmi  >= from && list.bmi <= too) {
         
          return list;
        }
      })
      console.log('filter',filter)
      this.setState({genderCount: filter.length, checkdob: true})
      // const unique = this.getUnique(arr).map(rrr => rrr)
      // console.log('uni',unique)
      // arr.filter(row => {
      //   if(row)
      // })
      // console.log('result',this.getOccurrence(arr,   this.getUnique(arr).map(rrr => rrr)))

    } else {
      this.setState({ checkdob: true})
    }
  }

  genderSelection = e => {
    const { value } = e.target
    console.log(value)
    this.setState({genderSelected: value})
  }

 

  render() {
  
    console.log('first',this.state.responses)
    let arr = [];
    let sendCSV = []
    let alQuestion = []
    let checkItem = ''
    const { checkdob, responses, data, distinct, selected } = this.state;
    data.map(row => {
      arr.push(row[1]);
    });
    const response_json =  arr.map((r,i)=> {
      return JSON.parse(r)
     })
     const another_json =  response_json.map((r,i)=> {
      // r[359] = r[359].split("").reverse().join("");
      // r[2] = md5(r[2]);
      // delete r[3];
      // delete r[4];
      // delete r[361];
      return r[10]
     })
     const csv =  this.getUnique(another_json).map(m => {
    
      return m + " : " + this.getOccurrence(another_json, m) 
    })
    console.log(
      "cds",
      // another_json
      JSON.stringify(csv, 0,1)
    );
    // another_json.filter(male => male == "Male")
    
    return (
      <React.Fragment>
        <Header title="Reporting APP"/>
        <div className="container">
          <div className="row" style={{marginTop:60}}>
            <div className="col-md-10 col-md-offset-1" style={{marginTop:20}}>
              <table className="table">
                <tr>
                  <td>
                    <select
                      name="prt"
                      className="form-control"
                      onChange={e => this.selectParticipantInfo(e)}
                    >
                      <option value="">Select Participant Information</option>
                      {responses.map((list, i) =>
                        Object.entries(list).map((item,j) => {
                            if(i == 1) {
                                return <option value={item[0]}>{item[0]}</option>
                            }
                          
                        })
                      )}
                    </select>
                  </td>
                </tr>
              </table>
              {this.state.list ? (
         
         <div className="" style={{marginTop:20}}>
           <h2 className="h4 lead text-center">
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
               checkItem = row
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
           <a href={`data:${JSON.stringify(csv,1,1)}`}  download="csv.csv">download JSON</a>
           <hr />
           <CsvDownload data={csv} />
           {
             checkItem == 'Male' ?
             <div className="ad_search">
               <h4>Advance Search</h4>
               <table className="table">
                 <thead>
                   <tr>
                   <th>Query</th>
                   <th>Count</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>
                       <p className="text inline"> How  many &nbsp;   
                          <select onChange={(e) => this.genderSelection(e)}>
                          <option value="">Select Options</option><option value="Male">Male </option><option value="Female">Female</option></select> 
                            &nbsp; have same &nbsp;
                            <select >
                              <option>Select Options</option>
                              <option value="bmi">BMI</option>
                              <option value="dob">Date of Birth</option>
                            </select> &nbsp; ranges from <input onChange={(e) => this.setState({from: e.target.value})} type="number" style={{width:60}} /> &nbsp; 
                            to <input type="number" style={{width:60}} onChange={(e) => this.setState({too:e.target.value})} /><button onClick={this.advanceSearch}>Done</button>
                        </p>
                      </td>
                      <td>  { checkdob ? this.state.genderCount: ''}</td>
                   </tr>

                 </tbody>
               </table>
               <div className="col-md-10">
                 
                </div>
                
                  <div className="col-md-3">
                   
                  {/* <form className="form-inline">
                    <label>From</label><input type="date" />
                    <label>To</label><input type="date" />
                  </form> */}
                  </div> 
               
               </div>:''
           }
           <div style={{}}>
           {/* <CSVDownload data={Object.entries(sendCSV)} target="_blank">
               <p>Download Excel format</p>
           </CSVDownload> */}
           </div>
         </div>
      
   ) : (
     <div></div>
   )}
            </div>
         
        
        </div></div>
        <Footer />
      </React.Fragment>
    );
  }
}

Reporting.propTypes = {
    title: PropTypes.string,
    responses: PropTypes.array,
    name: PropTypes.string,
    data: PropTypes.array,
    list: PropTypes.bool
}

export default Reporting;
