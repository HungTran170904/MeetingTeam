import { Button, Modal } from "react-bootstrap";
import { unfriend } from "../../API/UserAPI.js";
import { useSnackbar } from "notistack";

const UnfriendModal=({friend, setShow})=>{
          const { enqueueSnackbar } = useSnackbar();
          function showSnackbar(content, isSuccess){
                    const config = {variant:(isSuccess?"success":"error"),anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                    enqueueSnackbar(content, config);
          }
          function handleYesBtn(){
                    unfriend(friend.id).then(res=>{
                              showSnackbar("Unfriend successfully",true);
                              setShow(false);
                    }).catch(err=>showSnackbar(err.response.data,true));
          }
          return(
                    <Modal show={true} onHide={()=>setShow(false)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Unfriend Modal</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <div>Are you sure to unfriend with {friend.nickName} ?</div>
                              </Modal.Body>
                              <Modal.Footer>
                                        <Button variant="warning" onClick={()=>setShow(false)}>Cancel</Button>
                                        <Button variant="primary" onClick={handleYesBtn}>Yes</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default UnfriendModal;