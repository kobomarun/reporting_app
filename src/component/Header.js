import React from 'react'
import  { Link } from 'react-router-dom'
import '../Style.css'
import Logo from '../54gene_Logo.svg'

const Header = (props) => (
<React.Fragment>
    <div className="container-fluid header_bg">
        <div className="row" style={{marginLeft:55, marginTop:20}}>
           <Link to="/"> <img src={Logo} alt="54gene logo" style={{width:100, borderRadius:20}}/></Link>
        </div>
    </div>
    <div className="container-fluid header_bg">
        <div className="row">
        <h1 className="header">{props.title}</h1>
        </div>
    </div>
</React.Fragment>
)

export default Header;