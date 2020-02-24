import React from 'react';
import {Route} from 'react-router-dom'
import Home from './component/Home'
import Reporting from './component/Reporting'
function App() {
  return (
    <div className="App">
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/reporting" exact>
        <Reporting />
      </Route>
    
    </div>
  );
}

export default App;
