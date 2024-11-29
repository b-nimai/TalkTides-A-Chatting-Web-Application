import { Box, Input, Spinner, Text } from '@chakra-ui/react'
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
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useState } from "react"
import toast from 'react-hot-toast'
import ResultLoading from './ResultLoading'
import UserListItem from './UserListItem'
import { API_BASE_URL } from '../../config'

function SideDrawer() {
    const { user, SetisLoggedin, setSelectedChat, chats, setChats } = useChatState();
    const [open, setOpen] = useState(false)
    const [search, setSearch ] = useState("");
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const navigate = useNavigate();

    // logout function
    const logOutHandler = async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/user/logout`,
          {},
          {
            withCredentials: true
          }
        );
        SetisLoggedin('false');
        navigate('/');
      } catch (error) {
        console.log("Error While logout: ", error.message);
      }
    }
    // Search User function
    const searchHandler = async() => {
      if(!search) {
        toast('Enter Something to Search!', {
          icon: '👏',
        });
        return;
      }

      try {
        setLoading(true);
        const {data} = await axios.get(`${API_BASE_URL}/api/user?search=${search}`,
          {
            withCredentials: true
          }
        )
        setLoading(false);
        setSearch("")
        setSearchResult(data);
      } catch (error) {
        toast.error("Could't Find the Users")
      }
    }
    // Access Chat function
    const accessChat = async (userId) => {
      
      try {
        setLoadingChat(true);
        const { data } = await axios.post(`${API_BASE_URL}/api/chat`, 
          {
            userId
          },
          {
            withCredentials: true
          }
        )
        // If newly created chat not found in my chats then append it to my chats
        if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

        setSelectedChat(data);
        setLoadingChat(false);
        setOpen(false);
      } catch (error) {
        console.log("Error message: ", error.message);
        console.log("Error: " , error)
        toast.error("Error Accessing chat")
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
            <Button bg={'rgba(255, 255, 255)'} onClick={() =>setOpen(true)}>
                <i className="fa-brands fa-searchengin fa-lg"></i>
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
                    <i className="fa-solid fa-bell fa-xl"></i>
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

      {/* Drawer component */}
      <DrawerRoot 
        open={open} onOpenChange={(e) => setOpen(e.open)}
        placement={'start'}
      >
        <DrawerBackdrop />
        {/* <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </DrawerTrigger> */}
        <DrawerContent bg={'rgba(255, 255, 255, 0.9)'} color={'black'} colorPalette={'cyan'}>
          <DrawerHeader>
            <DrawerTitle
              textAlign={'center'} fontSize={'2xl'}
              fontWeight={'bold'} fontFamily={'Woks sans'}
              borderBottomWidth={'1px'}
            >
              Search Users
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box 
              display={'flex'} pb={2}
            >
              <Input 
                placeholder='Search by Name or Email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
                onClick = {searchHandler}
              >
                <i className="fa-brands fa-searchengin fa-lg"></i>
              </Button>
            </Box>
            {/* Show the search Result */}
            { loading ? (
              <ResultLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem 
                  key={user._id}
                  user = {user}
                  handleFunction = {() => accessChat(user._id)}
                />
              ))
            )}
            {/* if chatLoading is true, then show a spinner */}
            {loadingChat && <Spinner color="teal.500" size="lg" ml='auto' display={'flex'} />}
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={() => setOpen(false)} borderRadius={'2xl'}><i className="fa-solid fa-arrow-left"></i></Button>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </div>
  )
}

export default SideDrawer
