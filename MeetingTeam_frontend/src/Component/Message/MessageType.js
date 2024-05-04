import "./Message.css"
import VideoIcon from "../../Resource/VideoIcon.png"
import AudioIcon from "../../Resource/AudioIcon.png"
import FileIcon from "../../Resource/FileIcon.jpg"
const MessageType=({message})=>{
    if(message.messageType=="TEXT")
        return message.content;
    else if(message.messageType=="UNSEND"){
              return (<div className="unsendMessage">Message has been deleted</div>);
    }
    else if(message.messageType=="IMAGE"){
              return (<img className="customImage" src={message.content} alt={message.fileName}/>)
    }
    else if(message.messageType=="VIDEO"){
              return (
                <div>
                        <img src={VideoIcon} alt="VideoIcon" width="40px" height="40px"/>
                        <a href={message.content}>{message.fileName}</a>
                </div>
            )
    }
    else if(message.messageType=="AUDIO"){
            return (
                <div>
                        <img src={AudioIcon} alt="AudioIcon" width="40px" height="40px"/>
                        <a href={message.content}>{message.fileName}</a>
                </div>
            )
    }
    else if(message.messageType=="FILE"){
        return (
            <div>
                    <img src={FileIcon} alt="FileIcon" width="40px" height="40px"/>
                    <a href={message.content}>{message.fileName}</a>
            </div>
        )
    }
}
export default MessageType;