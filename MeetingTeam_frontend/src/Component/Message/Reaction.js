import { Col, Modal, Row } from "react-bootstrap";
import "./Message.css"
export const ReactionList=({reactions, setReactions})=>{
          if(!reactions) return;
          const reactionList=new Set();
          reactions.forEach((reaction)=>{
                    reactionList.add(reaction.emojiCode);
          })
          if(reactionList.size>0)
                    return(
                              <div className="reaction" onClick={(e)=>setReactions(reactions)}>
                              {Array.from(reactionList).map(code=>String.fromCodePoint(`0x${code}`))} {reactions.length}
                              </div>
                    )
}
export const ReactionDetails=({reactions, people, setShow})=>{
          return(
          <Modal show={reactions} onHide={()=>setShow(null)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Emotions about the message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                             {reactions.map(reaction=>{
                                        let index=people.findIndex((person)=>(person.id===reaction.userId));
                                        const owner=people[index];
                                        return(
                                                  <Row key={owner.id}>
                                                            <Col lg="2">
                                                                      <img src={owner.urlIcon} alt="avatar" width="30px" height="30px"/>
                                                            </Col>
                                                            <Col lg="8">{owner.nickName}</Col>
                                                            <Col lg="2">{String.fromCodePoint(`0x${reaction.emojiCode}`)}</Col>
                                                  </Row>
                                        )
                             })}
                    </Modal.Body>
          </Modal>
          )
}