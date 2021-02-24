import React, { Component } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import PropTypes from 'prop-types'
import "../Style.css";
import Header from "./Header";
import Footer from "./Footer";
import Papa from 'papaparse'
var md5 = require('md5');
const config = {
	delimiter: " ",	// auto-detect
	newline: "",	// auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: false,
	transformHeader: undefined,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: false,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: true,
	downloadRequestHeaders: undefined,
	downloadRequestBody: undefined,
	skipEmptyLines: false,
	chunk: undefined,
	chunkSize: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined,
	delimitersToGuess: [',', ' ', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [],
      firstresponses: [],
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
      too:0,
      pid:[],
      dataset:[]
    };
  }

  componentDidMount() {
    var dataset = {};    
    Papa.parse("http://localhost:8888/ndasuapp/yale.csv", {
      download: true,
      dynamicTyping: true,
      complete:  function (results) {
         dataset =  results.data;
         
         localStorage.setItem('dataset',JSON.stringify(dataset))
        // this.setState({dataset})
      }
    });
 
    const pid_data = JSON.parse(localStorage.getItem('dataset'));
    console.log('myyy',pid_data)
    let newData = []
 
    fetch("https://rp.54gene.com/api/getResponse/15/66")
      .then(response => response.json())
      .then(json =>  {
        console.log('fofo',json.data[0])
        for(let i = 0; i < json.data.length; i++) {
          // console.log('state',this.state.responses[i].generated_participant_study_id);
          // console.log(i)
          // console.log('pids',pid_data[i][0])
          for(let j=0; j< pid_data.length; j++) {
            // console.log('hmmm',JSON.parse(json.data[i].response))
            // if(JSON.parse(json.data[i].response) === pid_data[j][0]) {
             
            //   newData.push(json.data[i])
            // }
          }
         
        }
        this.setState({responses:newData})
       
      })
      .catch(err => console.log("fetch error:", err));

   

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
    const pids = allSelected.filter(dd => {
      if (dd[0] === 'generated_participant_study_id') {
        return [dd[0]];
      }
    });
    console.log("sele", pids);
    this.setState({
      name: response,
      count: this.state.responses.length,
      distinct: this.getUnique(allSelected),
      data: filterdData,
      pid:pids,
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
   
const SQ = JSON.parse(localStorage.getItem('dataset'));
const another_json = SQ.map(dd => {
  return {
    'pid' : dd[0],
    'hash' : md5(dd[0])
    
  }
        
});

    console.log('first',this.state.responses)
    let arr = [];
    let sendCSV = []
    let alQuestion = []
    let checkItem = ''
    const { checkdob, responses, data, distinct, selected } = this.state;
    data.map(row => {
      arr.push(row[1]);
    });
    console.log(
      "array",
      arr
    );
    const response_json =  arr.map((r,i)=> {
      return JSON.parse(r)
     })
     const another_jsons =  response_json.map((r,i)=> {
  

      delete r[418];

      r['participant_study_id'] = md5(this.state.pid[i][1])
      return r 
     })
    console.log(
      "change",
    JSON.stringify(another_json)
    );
    
    
    // console.log('que',alQuestion)
    return (
      <React.Fragment>
        <Header title="Reporting for AfRef Participants"/>
        <div style={{}}>
            <CSVLink data={another_json} target="_blank">
               <p>Download Excel format</p>
           </CSVLink> 
           </div>
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
           <a href={`data:${JSON.stringify(another_json)}`}  download="vascular.json">download JSON</a>
           <hr />
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
