import { Box, Text } from '@chakra-ui/react'
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Avatar } from "@/components/ui/avatar"
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import React from 'react'
import { useChatState } from '../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SideDrawer() {
    const { user, SetisLoggedin } = useChatState();
    const navigate = useNavigate();

    const logOutHandler = async () => {
      try {
        await axios.post("https://talktide-backend.vercel.app/user/logout");
        SetisLoggedin('false');
        navigate('/');
      } catch (error) {
        console.log("Error While logout: ", error.message);
      }
    }
  return (
    <div>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'rgba(255, 255, 255, 0.5)'}
        width={'100%'}
        p={'5px 10px'}
        borderWidth={'1px'}
        borderRadius={'5px'}
      >
        <Tooltip 
            showArrow 
            content="Search Users to Chat"
            positioning={{ offset: { mainAxis: 0, crossAxis: 0} }}
        >
            <Button bg={'rgba(255, 255, 255)'}>
                <i class="fa-brands fa-searchengin fa-lg"></i>
                <Text display={{base:'none', md:'flex', px:4}}>
                    Search User
                </Text>
            </Button>
        </Tooltip>

        <Text fontSize={'2xl'} fontFamily={'Work sans'} color={'black'} fontWeight={'bold'}>
            TalkTides
        </Text>

        <Box 
            display={'flex'}
            gap={{base:'3', md:'10'}}
        >
            <MenuRoot>
              <MenuTrigger asChild>
                <button style={{cursor: 'pointer', padding:'5px'}}>
                    <i class="fa-solid fa-bell fa-xl"></i>
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="new-txt">New Text File</MenuItem>
              </MenuContent>
            </MenuRoot>
            
            <MenuRoot>
              <MenuTrigger asChild>
                <button style={{cursor: 'pointer', padding:'5px'}}>
                    <Avatar size="md" name={user.name} src={user.profilePic} />
                </button>
              </MenuTrigger>
              <MenuContent>
                <ProfileModal user={user}>
                  <MenuItem value="new-txt">My Profile</MenuItem>
                </ProfileModal>
                <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
              </MenuContent>
            </MenuRoot>
        </Box>
      </Box>
    </div>
  )
}

export default SideDrawer
