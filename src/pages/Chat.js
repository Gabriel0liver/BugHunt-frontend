import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '../providers/AuthProvider';
import hackerService from '../lib/hacker-service'
import chatService from '../lib/chat-service'

import socketManagerClient from "../socketManagerClient";
import { format } from 'util';

class Chat extends Component {

  state={
    message:"",
    messageList: [],
    firstGet: true
  }

  componentDidMount(){
    this.handleGetMessages();
    socketManagerClient.initSocketUser(this.props.match.params.id);
    let socket = socketManagerClient.getSocket();
    socket.on("NEW_MESSAGE", () => {
       this.handleGetMessages();
    });
  }

  handleChange = (event) =>{
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleSendMessage = () => {
    chatService.postMessage(this.props.match.params.id, this.state.message)
      .then((data) => {
        this.setState({
          message: ""
        })
        
      })
  }

  handleGetMessages = () => {
    chatService.getMessages(this.props.match.params.id)
      .then(messageList => {
        this.setState({
          messageList
        })
        if(!this.state.firstGet){
          this.messagesEnd.scrollIntoView({behavior: "smooth"});
        }else{
          this.messagesEnd.scrollIntoView();
          this.setState({
            firstGet: false
          })
        }
      })
  }

  render() {

    const formatedMessages = this.state.messageList.map(message => {
      if(this.props.user.type === message.type){
        return <li className="right-message">{message.text}</li>
      }else{
        return <li className="left-message">{message.text}</li>
      }
      
    })

    return (
      <div>
        <div className="message-box">
          <div>
          {formatedMessages}
          </div>
          
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <input type="text" name="message" onChange={this.handleChange} value={this.state.message}/>
        <button onClick={this.handleSendMessage}>Send message</button>
      </div>
    )
  }
}

export default withAuth(Chat);