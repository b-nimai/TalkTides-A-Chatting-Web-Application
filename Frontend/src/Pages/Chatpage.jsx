import { Box } from "@chakra-ui/react";
import { useChatState } from "../components/Context/ChatProvider"
import MyChats from "../components/Chats/MyChats";
import ChatingSpace from "../components/Chats/ChatingSpace";
import SideDrawer from "../components/Chats/SideDrawer";


function Chatpage() {
  const { isLoggedin } = useChatState();
  return <div style={{width: "100%"}}>
    { isLoggedin &&<SideDrawer />}
    <Box
      display={"flex"}
      justifyContent={'space-between'}
      width={"100%"}
      h={"91vh"}
      p={'10px'}
    >
      {isLoggedin && <MyChats />}
      {isLoggedin && <ChatingSpace />}
    </Box>
  </div>
}

export default Chatpage
