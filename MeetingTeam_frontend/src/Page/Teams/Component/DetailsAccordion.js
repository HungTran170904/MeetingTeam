import { useSelector } from "react-redux";
import { tabTitles } from "../../../Util/Constraints.js";

const DetailsAccordion=({team,setChannelInfo, channelInfo})=>{
          const teams=useSelector(state=>state.teams);
          function handleClickTitle(teamId, tabIndex){
                    setChannelInfo({
                              teamIndex: teams.findIndex(team=>team.id==teamId),
                              channelIndex:-1, 
                              tabIndex:tabIndex
                    });
          }
          return(
          <div className="accordion-item">
                    <h2 className="accordion-header">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                        data-bs-target={"#details"+team.id} aria-expanded="false" 
                                        aria-controls={"details"+team.id}># TEAM DETAILS
                              </button>
                    </h2>
                    <div id={"details"+team.id} className="accordion-collapse collapse" data-bs-parent={"channelType-"+team.id}>
                              <div className="accordion-body">
                                        {tabTitles.map((title,index)=>(
                                                  <a className={"list-group-item list-group-item-action"+(index===channelInfo.tabIndex?" h6":"")} 
                                                            onClick={()=>handleClickTitle(team.id,index)} key={index}># {title}
                                                  </a>
                                        ))}
                              </div>
                    </div>
          </div>  
          )
}
export default DetailsAccordion;