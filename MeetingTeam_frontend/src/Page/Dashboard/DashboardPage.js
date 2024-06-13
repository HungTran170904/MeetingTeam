const DashboardPage = () =>(
          <div
              style={{
                 display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px"
              }}
          >
              <h3 style={{ marginBottom: "20px" }}>Meeting Team</h3>
              <div className="border border-dark rounded" style={{padding:"30px"}}>
                      <h5>Author: HungTran - Email: tienhung17092004@gmail.com</h5>
                      <h5 style={{ fontStyle: "italic" }}> A personal website about chat and video call application</h5>
                      <ol>
                              <li>The "Friends" tab shows list of active friends</li>
                              <li>The "Teams" tab shows list of teams you have joined in</li>
                              <li>The "Requests" shows all team and friend requests</li>
                              <li>The "Calendar" tab shows your upcoming meetings</li>
                      </ol>
              </div>
          </div>
    );
export default DashboardPage;