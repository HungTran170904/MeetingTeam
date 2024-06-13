import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { sendFriendRequest } from "../../../../API/FriendRequestAPI.js";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useState } from "react";

export const AddFriendModal=({setShow})=>{
        const [email, setEmail]=useState("");
        const [content, setContent]=useState("");
        const { enqueueSnackbar }=useSnackbar();
        function handleRequestButton(e){
                e.preventDefault();
                sendFriendRequest(email, content).then(res=>{
                        let config = {variant: 'success',anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}};
                        enqueueSnackbar("Send friend request successfully", config);
                        setShow(false);
                })
                .catch(err=>{
                        let config = {variant: 'error',anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}};
                        const errorPayload=err.response
                        if(errorPayload.status==400) enqueueSnackbar(errorPayload.data, config);
                        else enqueueSnackbar("Sending request failed! There was an unexpected error", config)
                })
        }       
          return(
          <Modal show={true} onHide={()=>setShow(false)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Add new friend</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Form>
                                        <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="email">
                                                            <Form.Label>Enter your friend email</Form.Label>
                                                            <Form.Control type="text" onChange={(e)=>setEmail(e.target.value)}/>
                                                  </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="channelName">
                                                            <Form.Label>Send some text message to your friend:</Form.Label>
                                                            <Form.Control as="textarea" rows={3} onChange={(e)=>setContent(e.target.value)}/>
                                                  </Form.Group>
                                        </Row>
                              </Form>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="primary" onClick={(e)=>handleRequestButton(e)}>Send friend request</Button>
                    </Modal.Footer>
          </Modal>
          )
}