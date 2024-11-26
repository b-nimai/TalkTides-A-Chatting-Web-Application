import React, { useEffect } from 'react'
import { useChatState } from '../Context/ChatProvider'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Button } from "@/components/ui/button";
import ResultLoading from './ResultLoading'
import { getSender } from './GetSender';
import GroupChatModal from './GroupChatModal';

function MyChats({ fetchAgain }) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = useChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat',
        {
          withCredentials: true
        }
      )
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast.error("Failed to load your chats.")
    }
  }

  useEffect(() => {
    fetchChats();
  }, [fetchAgain])

  return (
    <Box
      display={{base: selectedChat ? "none" : 'flex', md: 'flex'}} flexDirection={'column'}
      alignItems={'center'} p={3} w={{base: '100%', md: '30%'}} borderWidth={'1px'}
      borderRadius={'lg'} bg={'rgba(255, 255, 255, 0.5)'} color={'black'}
    >
      <Box
        pb={3} px={3} fontFamily={'Work sans'} fontSize={{base: '2xs', md: '2xl'}} display={'flex'}
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
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)} cursor={'pointer'} 
                bg={selectedChat === chat ? 'cyan.300' : 'cyan.500'} _hover={{background:'cyan.200'}}
                px={3} py={2} borderRadius={'lg'} key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ResultLoading />
        )}
      </Box>

    </Box>
  )
}

export default MyChats
