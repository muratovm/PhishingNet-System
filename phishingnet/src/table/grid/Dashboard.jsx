import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../App.css';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import PhishForm from '../add_row/PhishForm.jsx'
import PhishGrid from './PhishGrid.jsx'
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

let global_width = 400;

export const API_URL = "http://127.0.0.1:8000/api/encounters/";

class Dashboard extends Component {

processCellForClipboard = params => {
  return params.value;
};

  constructor(props) {
    super(props);
    const { login_data } = this.props.location
    let token = null;
    if (login_data != null){
        localStorage.setItem('token', login_data.token)
        token = login_data.token
    }
    else{
        token = localStorage.getItem('token');
    }
    this.state = {
      rowData:null,
      history: props.history,
      token: token
  }
  this.handleTableChange = this.handleTableChange.bind(this)
  this.handleLogout = this.handleLogout.bind(this)
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
      'Authorization': 'Token '+this.state.token
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

handleLogout(e){
    this.state.history.push("/")
}

handleTableChange(){
  let headers = {
    'Authorization': 'Token '+this.state.token
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


  render() {
    return (
      <div
        className="ag-theme-alpine"
      >
        <AppBar position="fixed" style={{ backgroundColor: '#ffffff'}}>
            <Toolbar >
                <IconButton edge="start" style={{marginRight: 2}} aria-label="menu">
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{flexGrow: 1, color:"#000000"}}>
                Dashboard
                </Typography>
                <Button onClick={this.handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
      
      <Grid container style={{marginTop:"70px",}}>
        <Grid item xs={12} md={12} lg={12} xl={9} style={{height:1000}}>
          <PhishGrid history={this.history} rowData={this.state.rowData}/>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={3}> 

            
            <PhishForm
              token={this.state.token}
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
export default Dashboard;