
import React, { Component } from 'react';
import '../../App.css';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import axios from "axios";
export const API_URL = "http://192.168.2.12:8000/api/encounters/";

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
      console.log(this.state);
      let form_data = new FormData();
      
      //let date = new Date(this.state.datetime);
      //let utc = date.toISOString();
      //alert(utc)
      
      form_data.append('url', "http://www.ara.com");
      form_data.append('sha256', "bbbbbbbbbbbbbbbbbbbbbbbbbbwhda");
      form_data.append('dated', "2020-07-05");
      form_data.append('time', "15:38:09");
      form_data.append('scores', '[{"type": "Image Score","score": 10}]');
      form_data.append('image', this.state.form_image, this.state.form_image.name);
      
      axios.post(this.state.url, form_data, {
        headers: {
          'content-type': 'multipart/form-data',
          'Accept':'*/*',
          'Authorization': 'Token ' + this.state.token
        }
      }).then(res => {
            console.log(res.data);
            let headers = {
              'Authorization': 'Token '+this.state.token
            }
            
            axios.get(API_URL,{
              headers: headers
            }).then(res =>{
              for(var i=0; i<res.data.length; i++){
                for(var j=0; j<res.data[i].scores.length; j++){
                  let type = res.data[i].scores[j].type
                  let score = res.data[i].scores[j].score
                  res.data[i][type] = score
                }
                delete res.data[i].scores
              }
              this.props.onTableChange(res.data)
            });
            
          })
          .catch(err => console.log(err))
    };
      
    render(){
        return(
            <form style={{width:"80%", margin:"auto", marginTop:"60px"}} onSubmit={this.handleSubmit} noValidate autoComplete="off">
              <Typography style={{width:"50%"}}>Details</Typography>
              <TextField style={{width:"50%"}} id="form_url" label="URL" variant="outlined" onChange={this.handleChange}/>
              <TextField style={{width:"50%"}} id="form_hash" label="Hash" variant="outlined"/>
              <Typography>Occurance</Typography>
              <TextField style={{width:"50%"}} id="form_data"  type="date" variant="outlined"/>
              <TextField style={{width:"50%"}} id="form_time"  type="time" variant="outlined"/>
              <Typography>Scores</Typography>
              <TextField style={{width:"50%"}} id="form_image_score" label="Image Score" type="number" variant="outlined"/>
              <TextField style={{width:"50%"}} id="form_hash_score" label="Hash Score" type="number" variant="outlined"/>
              <Typography>Image</Typography>
              <TextField style={{width:"100%"}} id="form_image" type="file" variant="outlined" accept="image/png, image/jpeg" onChange={this.handleImageChange} required/>
              <Button style={{width:"100%", padding:10, marginTop:"25px"}}type="submit" color="primary" variant="contained">Submit</Button>
            </form>
        )
    };
}

export default PhishForm