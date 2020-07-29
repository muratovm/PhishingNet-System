
import React, { Component } from 'react';
import '../../App.css';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import axios from "axios";
export const API_URL = "http://192.168.2.12:8000/api/encounters/upload";

class PhishForm extends React.Component{
  
    constructor(props) {  
      super(props);
      this.state = {
          url: props.url,
          token: props.token,
          form_url:'',
          form_hash:'',
          form_date:'',
          form_time:'',
          form_image_score:'',
          form_hash_score:'',
          form_image:null,
        }
      this.handleChange = this.handleChange.bind(this);
      this.handleImageChange = this.handleImageChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      };
      
    handleImageChange = (e) => {
      this.setState({
          form_image: e.target.files[0]
      })
    };

    handleSubmit = (e) => {
      e.preventDefault();
      let form_data = new FormData();
      form_data.append('url', this.state.form_url);
      form_data.append('sha256', this.state.form_hash);

      let strings = this.state.form_date.split("/");
      let date = strings.join("-")
      form_data.append('dated', date);
      form_data.append('time', this.state.form_time+":00");
      
      let scores = []
      if(this.state.form_image_score != ''){
        let image_score = {"type":"Image Score", "score":this.state.form_image_score}
        scores.push(JSON.stringify(image_score))
      }
      if(this.state.form_hash_score != ''){
        let hash_score = {"type":"Hash Score", "score":this.state.form_hash_score}
        scores.push(JSON.stringify(hash_score))
      }
      form_data.append('scores', "["+scores+"]");
      form_data.append('image', this.state.form_image, this.state.form_image.name);
      
      axios.post(this.state.url, form_data, {
        headers: {
          'content-type': 'multipart/form-data',
          'Accept':'*/*',
          'Authorization': 'Token ' + this.state.token
        }
      }).then(res => {this.props.onTableChange()})
        .catch(err => console.log(err))
    };
      
    render(){
        return(
            <form style={{width:"80%", marginRight:"auto", marginTop:"80px"}} onSubmit={this.handleSubmit} noValidate autoComplete="off">
              <Typography style={{width:"50%"}}>Details</Typography>
              <TextField style={{backgroundColor: '#ffffff', width:"100%"}} id="form_url" label="URL" variant="outlined" onChange={this.handleChange}/>
              <TextField style={{backgroundColor: '#ffffff', width:"100%"}} id="form_hash" label="Hash" variant="outlined" onChange={this.handleChange}/>
              <Typography>Occurance</Typography>
              <TextField style={{backgroundColor: '#ffffff',width:"100%"}} id="form_date"  type="date" variant="outlined" onChange={this.handleChange}/>
              <TextField style={{backgroundColor: '#ffffff',width:"100%"}} id="form_time"  type="time" variant="outlined" onChange={this.handleChange}/>
              <Typography>Scores</Typography>
              <TextField style={{backgroundColor: '#ffffff',width:"100%"}} id="form_image_score" label="Image Score" type="number" variant="outlined" onChange={this.handleChange}/>
              <TextField style={{backgroundColor: '#ffffff',width:"100%"}} id="form_hash_score" label="Hash Score" type="number" variant="outlined" onChange={this.handleChange}/>
              <Typography>Image</Typography>
              <TextField style={{backgroundColor: '#ffffff',width:"100%"}} id="form_image" type="file" variant="outlined" accept="image/png, image/jpeg" onChange={this.handleImageChange} required/>
              <Button style={{backgroundColor: '#D4D4D4',width:"100%", padding:10, marginTop:"25px"}} type="submit" color="black" variant="contained">Submit</Button>
            </form>
        )
    };
}

export default PhishForm