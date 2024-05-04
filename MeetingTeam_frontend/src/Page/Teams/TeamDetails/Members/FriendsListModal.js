import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Avatar from "../../../../Component/Avatar/Avartar.js";
import { addFriendsToTeam } from "../../../../API/TeamAPI.js";

const FriendsListModal=({team, setShow})=>{
          const members=team.members;
          const friends=useSelector(state=>state.friends);
          const [friendIds, setFriendIds]=useState([]);
          function handleCheckbox(friendId){
                    setFriendIds(prev=>{
                              prev.push(friendId);
                              return prev;
                    })
          }
          function addFriends(){
                    addFriendsToTeam(friendIds,team.id);
          }
          return(
          <Modal show={true} onHide={()=>setShow(false)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Friends List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Form>
                              {friends.map(friend=>{
                                        let index=members.findIndex(member=>member.u.id==friend.id);
                                        if(index===-1||members[index].role=="LEAVE") return(
                                                  <Row className="justify-content-begin"  key={friend.id}>
                                                            <Col lg="1">
                                                                      <Form.Check type="checkbox" onChange={()=>handleCheckbox(friend.id)}/>
                                                            </Col>
                                                            <Col lg="11">
                                                                      <Avatar src={friend.urlIcon}/>
                                                                      {friend.nickName}
                                                            </Col>
                                                  </Row>
                                        )
                              })} 
                              </Form>
                              <Row>
                                        <div>Send team id to invite friends:</div>
                                        <div><b>{team.id}</b></div>
                              </Row>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="primary" onClick={()=>addFriends()}>Add Friends</Button>
                    </Modal.Footer>
          </Modal>
          )
}
export default FriendsListModal;