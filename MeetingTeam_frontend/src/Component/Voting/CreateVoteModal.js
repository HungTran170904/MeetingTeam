import { Button, FloatingLabel, Form, InputGroup, Modal, Row } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { createVoting } from "../../API/VoteAPI.js";
import { useRef, useState } from "react";

const CreateVoteModal=({channel,setShow})=>{
          const [message, setMessage]=useState({
                content:"",
                createdAt: null,
                voting:{
                    isSingleAnswer: false,
                    endTime: null,
                    options: [{name:""},{name:""}],
                    events:[]
                }
            });
            const endDateRef = useRef();
            const endTimeRef = useRef();
            const [error, setError]=useState(null);

          function deleteOptionTb(index){
                const updatedData = { ...message };
                updatedData.voting.options=updatedData.voting.options.filter((_,i)=>i!=index);
                setMessage(updatedData);
          }
          function addOptionTb(){
            const updatedData = { ...message };
            updatedData.voting.options.push({name:""});
            setMessage(updatedData);
          }
          function handleOnChange(fieldName,e,index){
                const updatedData={...message};
                if(fieldName=="question")
                    updatedData.content=e.target.value;
                else if(fieldName=="options")
                    updatedData.voting.options[index].name=e.target.value;
                else if(fieldName=="endTime")
                    updatedData.voting.endTime=endDateRef.current.value+"T"+endTimeRef.current.value;
                else if(fieldName=="isSingleAnswer")
                    updatedData.voting.isSingleAnswer=e.target.checked;
                setMessage(updatedData);
          }
          function handleSubmit(){
                if(message.voting.options.length<2){
                    setError("Please add at least two options");
                    return;
                }
                else if(message.content.trim().length==0){
                    setError("Please fill in the question of the vote");
                    return;
                }                
                message.channelId=channel.id;
                message.createdAt=new Date();
                createVoting(message).then(res=>{
                    setShow({type:0, message:null});
                })
                .catch(err=>setError(err.response.data));
          }
          return(
          <Modal show={true} onHide={()=>setShow({type:0, message:null})}>
                    <Modal.Header closeButton>
                            <Modal.Title>Create new vote</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                              <Form.Group className="mb-3" controlId="question">
                                        <Form.Label>Vote Question</Form.Label>
                                        <Form.Control as="textarea" onChange={(e)=>handleOnChange("question",e)} rows={3} placeholder="Add your question here"/>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="question">
                                        <Form.Label>Options</Form.Label>
                                        {message.voting.options.map((option, index) =>{
                                            return(
                                                <InputGroup key={index} className="mb-3">
                                                    <Form.Control type="text" 
                                                        placeholder={`Option ${index}`}
                                                        onChange={(e)=>handleOnChange("options",e,index)} 
                                                        value={option.name}
                                                    />
                                                    <Button variant="outline-danger" onClick={()=>deleteOptionTb(index)}>X</Button>
                                                </InputGroup>
                                            )
                                        })}
                                        <Button variant="outline-primary" onClick={addOptionTb}>+ Add option</Button>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="endTime">
                                        <Form.Label>End Time (Optional)</Form.Label>
                                        <Form.Control type="date" ref={endDateRef} onChange={(e)=>handleOnChange("endTime",e)}/>
                                        <Form.Control type="time" ref={endTimeRef} onChange={(e)=>handleOnChange("endTime",e)}/>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="isSingleAnswer">
                                        <Form.Check type="switch" label="Allow to choose only one option" onChange={(e)=>handleOnChange("isSingleAnswer",e)}/>
                              </Form.Group>
                              {error!=null&&<div className="error">{error}</div>}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=>handleSubmit()}>Submit</Button>
                    </Modal.Footer>
         </Modal>
        )
}
export default CreateVoteModal;