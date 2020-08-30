import React, { Component } from 'react';
import { render } from '@testing-library/react';
import '../../App.css';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import axios from "axios";

const URL = "http://127.0.0.1:8000/api-token-auth/";

class Login extends React.Component{


    constructor(props) {  
        super(props);
        this.state = {
            username:null,
            password:null,
            alert:"hidden"
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit = (e) => {
    e.preventDefault();
    const {history} = this.props


    if(this.state.username != null && this.state.password != null){
        
        let form_data = new FormData();

        form_data.append('username', this.state.username);
        form_data.append('password', this.state.password);

        axios.post(URL, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept':'*/*'
            }
            }).then(res => {
                history.push({
                    pathname:"/dashboard", 
                    login_data:{
                        token: res.data.token
                    }
                })
                console.log(res.data)
            }).catch(err => {
                console.log(err);
                this.setState(
                    {
                        alert:"visible",
                        username: null,
                        password:null
                    }
                )
                Array.from(document.querySelectorAll("input")).forEach(
                    input => (input.value = "")
                  );
                }
            )
    }

    
    };
    
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      };

    render(){
        return(
            <form onSubmit={this.handleSubmit} style={{margin:"auto", paddingTop:"100px", width:"50%", maxWidth:"700px"}}>
              <Typography variant="h2" style={{width:"100%", margin:"10px"}}>Login</Typography>
              <TextField style={{width:"100%", margin:"auto", marginBottom:"10px"}} id="username" label="username" variant="outlined" onChange={this.handleChange}/>
              <TextField ref={el => this.password = el} style={{width:"100%", margin:"auto", marginBottom:"10px"}} id="password" label="password" type="password" variant="outlined" onChange={this.handleChange}/>
              
              <Box ref="alert" style={{width:"100%", margin:"0px"}} visibility={this.state.alert}>
                    <Typography color='secondary'>Incorrect username or password</Typography>
              </Box>
              <Button style={{backgroundColor: '#D4D4D4',width:"100%",  marginBottom:"10px", display:"flex"}}type="submit"  variant="contained">Login</Button>
              <Link href="/signup" variant="body2">Sign Up</Link>
              <br></br>
              <Link href="#" variant="body2">Forgot Password</Link>
            </form>
        );
    }
}

export default Login;