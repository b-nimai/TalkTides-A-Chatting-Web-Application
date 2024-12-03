import { Box } from "@chakra-ui/react";
import { useChatState } from "../components/Context/ChatProvider"
import MyChats from "../components/Chats/MyChats";
import ChatingSpace from "../components/Chats/ChatingSpace";
import SideDrawer from "../components/Chats/SideDrawer";
import { useState } from "react";


function Chatpage() {
  const { isLoggedin } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return <div style={{width: "100%"}}>
    { isLoggedin &&<SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    <Box
      display={"flex"}
      justifyContent={'space-between'}
      width={"100%"}
      h={"91vh"}
      p={'10px'}
    >
      {isLoggedin && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      {isLoggedin && <ChatingSpace fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
    </Box>
  </div>
}

export default Chatpage
