import React, { Component } from "react";
// import data from '../data.json'
import '../Style.css'

class Reporting extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            posts: [],
            count: 0,
            name: '',
            data:[],
            distinct:[],
            list: false
        }
    }

    componentDidMount() {
        fetch('https://rp.54gene.com/api/get_participants')
        .then(response => response.json())
        .then(json => this.setState({posts:json.data}))
        .catch(err => console.log('fetch error:', err))
        this.setState({distinct: this.state.posts})
    }

     getUnique = (array) => {
        let uniqueArray = [];
        
        // Loop through array values
        let c = 0;
        for(let i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
            c++

        }
        console.log('c', c++)
        return uniqueArray;
    }
    

    selectParticipantInfo(e) {
        console.log(e.target.value)
        const response = e.target.value
        let allSelected = []
        let addKey = []
        this.state.posts.map((item, i) => {
            
            allSelected.push(item)
        })
        console.log('sele',allSelected)
        this.setState({name: response, 
            count: allSelected.length, 
            distinct: this.getUnique(allSelected),
            data: allSelected,
            list: true
        })
    }

    render() {
        const { posts, distinct } = this.state
        console.log(distinct)
        return(
            <React.Fragment>
                <div className="container page middle">
                <h1 className="jumbotron">Reporting Participant Information</h1>
                
                <div className="row">
                    <div className="col-md-12">
                    <table className="table">
                    {/* <thead className="thead-dark">
                        <tr>
                            <th>Question</th>
                            <th>Response</th>
                        </tr>
                    </thead> */}
                       
                                    
                                        <tr>
                                            <td>
                                            <select name="prt" className="form-cntrol" onChange={(e) => this.selectParticipantInfo(e)}>
                                               <option value="">Select Participant Information</option> 
                                               {
                                                   this.state.posts.map((list, i) => (
                                                       this.getUnique(Object.entries(list)).map(item => {
                                                        return(
                                                            <option value={item[0]}>{item[0]}</option>
                                                        )
                                                       })
                                                       
                                                    ))
                                                        
                                                }
                                            </select></td>
                                                                                   {/* <td style ={{fontSize:12, cursor:'pointer'}} onClick={() => this.getQuestion(item[1])}>{item[0]}</td>
                                        <td style ={{fontSize:12, cursor:'pointer'}}>{item[1]}</td> */}
                                    </tr>
                           
                    </table>
                    </div>
                    {/* <div className="col-md-6">
                    <select className="form-cntrol" onChange={(e) => this.selectTodo(e)}>
                        <option value="">What Do you want to do</option>
                            { this.state.distinct.map(row => (
                                <option value={row}>{row}</option>

                            ))}
                            <option value="list">List All </option>
                        </select>
                    </div> */}
                </div>
                </div>
                {this.state.list ? 
                <div className="container page">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="h4">List view for {this.state.name}. Total: <span className="badge"> {this.state.count}</span></h2>
                        <div className="num_count badge">{`${this.state.name}(${this.state.count})`}</div>
                            <ul className="list-group">
                                {this.getUnique(this.state.posts).map(newItem => {
                                    Object.entries(newItem).map(row => {
                                        console.log('rr',row[1])
                                        return (
                                            <li className="list-group-item">{row[1]} <span className="badge">{row.length}</span></li>
                                        )
                                        })

                            })}
                            </ul>
                    </div>
                </div>
                </div>
               : <div></div>}
            </React.Fragment>
            
        )
    }
}

export default Reporting;