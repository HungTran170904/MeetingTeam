import { Alert } from "react-bootstrap";

const ReplyAlert=({replyMessage, setReplyMessage})=>{
    function handleClose(){
        setReplyMessage(null);
    }
    let content=replyMessage.content;
    if(content&&content.length>61) content=content.substring(0,60)+"...";
    return(
        <Alert variant="secondary" onClose={() =>handleClose()} dismissible>
               <strong>Reply to:</strong>  {replyMessage.content}
        </Alert>
    )
}
export default ReplyAlert;