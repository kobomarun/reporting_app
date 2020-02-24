import React from 'react'
import PropTypes from 'prop-types'
import {Link } from 'react-router-dom'
import '../Style.css'
import Header from './Header'
import Footer from './Footer'

class Home extends React.Component {
    state = {}
    render() {
        return(
            <React.Fragment>
                <Header  title="Reporting Application for 54gene Research Studies" />
                <div className="container" style={{marginLeft:-20}}>
                    <div className="row">
                     <Link to="/">
                        <div className="col-md-3 col-md-offset-1 card">
                            <div className="card-header">
                                <h3 className="text-center">Heritage Study</h3>
                            </div>
                        </div>
                        </Link>
                        <div className="col-md-3 col-md-offset-1 card">
                        <div className="card-header">
                                <h3 className="text-center">Heritage Pilot Study</h3>
                            </div>
                        </div>
                        <Link to="/reporting">
                        <div className="col-md-3 col-md-offset-1 card">
                        <div className="card-header">
                                <h3 className="text-center">AfRef Study</h3>
                            </div>
                        </div>
                        </Link>  
                    </div>
                </div>
               <Footer />
            </React.Fragment>
        )
    }

}

Home.propTypes = {
    title: PropTypes.string
}

export default Home;