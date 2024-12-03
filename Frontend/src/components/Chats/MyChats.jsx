import React, { useEffect } from 'react'
import { useChatState } from '../Context/ChatProvider'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Button } from "@/components/ui/button";
import ResultLoading from './ResultLoading'
import { getSender } from './GetSender';
import GroupChatModal from './GroupChatModal';
import { API_BASE_URL } from '../../config'

function MyChats({ fetchAgain, setFetchAgain }) {
  const { 
    selectedChat, 
    setSelectedChat, 
    user, 
    chats, 
    setChats, 
    notification, 
    setNotification 
  } = useChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/chat`,
        {
          withCredentials: true
        }
      )
      setChats(data);
    } catch (error) {
      toast.error("Failed to load your chats.")
    }
  }

  // Fetch notifications
  const fetchNotifications = async() => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/notification`, {
        withCredentials: true
      });
      setNotification(data);

    } catch (error) {
      toast.error('Failed to load notifications.')
    }
  }

  useEffect(() => {
    fetchChats();
    fetchNotifications();
  }, [fetchAgain])
  return (
    <Box
      display={{base: selectedChat ? "none" : 'flex', md: 'flex'}} flexDirection={'column'}
      alignItems={'center'} p={3} w={{base: '100%', md: '30%'}} borderWidth={'1px'}
      borderRadius={'lg'} bg={'rgba(255, 255, 255, 0.5)'} color={'black'}
    >
      <Box
        pb={3} px={3} fontFamily={'Work sans'} fontSize={{base: '2xl', md: '2xl'}} display={'flex'}
        w={'100%'} justifyContent={'space-between'} alignItems={'center'}
        borderBottomWidth={'1px'}
      >
        My Chats

        <GroupChatModal>
          <Button fontSize={{base: '17px', md: '10px', lg: '17px'}} display={'flex'} gap={5} >
            New Group
            <i className="fa-solid fa-plus"></i>
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={'flex'} flexDirection={'column'} p={3}   
         w={'100%'} h={'100%'} 
        borderRadius={'lg'} overflow={'hidden'}
      >
        {chats ? (
          <Stack 
            overflowY={'auto'} // Allow vertical scrolling
            css={{
              '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for Chrome, Safari, and Edge
              'msOverflowStyle': 'none', // Hide scrollbar for Internet Explorer and Edge
              'scrollbarWidth': 'none', // Hide scrollbar for Firefox
            }}
          >
            {chats.map((chat) => {
              // Check if there is unread notifications for the current chat
              const unreadForChat = notification.filter(
                (n) => n.chat._id === chat._id && !n.isRead
              )
        
              return (
                <Box
                  onClick={() => {
                    setSelectedChat(chat);
                    // Mark notifications for this chat as read
                    unreadForChat.forEach(async (notify) => {
                      await axios.put(
                        `${API_BASE_URL}/api/notification/markAsRead`, {
                          notificationId: notify._id
                        }, {
                          withCredentials: true
                        }
                      );
                      setFetchAgain(!fetchAgain);
                    });
                    // Update notifications  state for the selected chat
                    setNotification((prev) =>
                      prev.map((n) =>
                        n.chat._id === chat._id ? { ...n, isRead: true } : n
                      )
                    );
                  }}
                  cursor={'pointer'} 
                  bg={selectedChat === chat ? 'cyan.300' : 'cyan.500'} _hover={{background:'cyan.200'}}
                  px={3} py={2} borderRadius={'lg'} key={chat._id}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                  </Text>
                  {unreadForChat.length > 0 && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: '8px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '12px',
                      }}
                    >
                      {unreadForChat.length} New
                    </span>
                  )}
                </Box>
              )
            })}
          </Stack>
        ) : (
          <ResultLoading />
        )}
      </Box>

    </Box>
  )
}

export default MyChats
