import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import PhishForm from './table/add_row/PhishForm.jsx'
import PhishGrid from './table/grid/PhishGrid.jsx'

let global_width = 400;

export const API_URL = "http://192.168.2.12:8000/api/encounters/";

class App extends Component {

processCellForClipboard = params => {
  return params.value;
};

  constructor(props) {
    super(props);
    this.state = {
      rowData:null
  }
  this.handleTableChange = this.handleTableChange.bind(this)
}

  
updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
  if(this.state.gridApi != null){
    global_width = window.innerWidth
    this.state.gridApi.refreshCells({columns:["url"]});
  }
}

  componentDidMount() {
    this.updateWindowDimensions();
    
    let headers = {
      'Authorization': 'Token 34b970280dd42a28978b831e1fb545ca5cf074ff'
    }
    axios.get(API_URL,{
      headers: headers
    }).then(res =>{
      //var obj = JSON.parse(res.data[0]);
      for(var i=0; i<res.data.length; i++){
        for(var j=0; j<res.data[i].scores.length; j++){
          let type = res.data[i].scores[j].type
          let score = res.data[i].scores[j].score
          res.data[i][type] = score
        }
        delete res.data[i].scores
      }
      
      this.setState({
        isLoaded: true,
        rowData: res.data
      });
    })
  }

handleTableChange(data){
  alert(data)
  this.setState(
    {
      isLoaded: true,
      rowData: data
    }
  );
} 
  render() {
    return (
      <div
        className="ag-theme-alpine"
      >
      <Grid container>
        <Grid item xs={12} md={12} lg={12} xl={9} style={{height:1000}}>
          <PhishGrid rowData={this.state.rowData}/>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={3}> 
            <PhishForm 
              url="http://192.168.2.12:8000/api/encounters/upload"
              token="34b970280dd42a28978b831e1fb545ca5cf074ff"
              onTableChange={this.handleTableChange}
            />
        </Grid>
      </Grid>

      </div>
    );
  }
}


function resize(api){
  api.sizeColumnsToFit();
}
export default App;