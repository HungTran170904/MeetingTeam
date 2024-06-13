import { Button, Form, Modal } from "react-bootstrap";
import { chooseOption } from "../../API/VoteAPI.js";
import { useState } from "react";

const VotingModal=({message,setShow})=>{
          const [optionNames, setOptionNames]=useState([]);
          function handleSubmit(){
                    if(optionNames.length==0) return;                              
                    chooseOption(message.id, optionNames).then(res=>{
                              setShow({type:0, message: null});
                    })
                    .catch(err=>alert(err));
          }
          function clickOption(optionName){
                    if(message.voting.isSingleAnswer) setOptionNames([optionName]);
                    else{
                        let isExist=false;
                        const updatedData=optionNames.map(name=>{
                                if(name==optionName) isExist=true;
                                else return name;
                        });
                        if(!isExist) updatedData.push(optionName);
                        setOptionNames(updatedData);
                    }
          }
          var type=message.voting.isSingleAnswer?"radio":"checkbox";
          return(
                    <Modal show={true} onHide={()=>setShow(0)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>{message.content}</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <Form>
                                        {message.voting.options?.map((option,index)=>
                                                  <Form.Check key={index} type={type} name="votingOption" disabled={message.voting.isBlocked}
                                                            label={option.name} onClick={()=>clickOption(option.name)}/>
                                        )} 
                                  </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                  <Button variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default VotingModal;