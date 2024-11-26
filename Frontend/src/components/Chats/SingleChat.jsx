import React from 'react'
import { useChatState } from '../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/react';
import { Button } from "@/components/ui/button"
import { getSender, getSenderFull } from './GetSender';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, setSelectedChat, selectedChat } = useChatState();
  return (
    <>
      {
        selectedChat ? (
            <>
                <Text
                    fontSize={{base: "2xl", md: "2xl"}}
                    fontFamily={"Work sans"} pb={3} px={2}
                    w={'100%'} display={"flex"} alignItems={"center"}
                    justifyContent={{base: 'space-between'}}
                > 
                    <Button
                        display={{base: "flex", md: 'none'}}
                        onClick={() => setSelectedChat("")}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </Button>

                    {
                        !selectedChat.isGroupChat ? (
                            <>
                               {getSender(user, selectedChat.users)} 
                               <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                    <Button>
                                        <i className="fa-solid fa-user"></i>
                                    </Button>
                                </ProfileModal>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

                            </>
                        )
                    }

                </Text>
                <Box
                    display={"flex"} flexDirection={'column'} justifyContent={'flex-end'}
                    p={3} bg={"rgba(232, 232, 232, 0.5)"} w={'100%'} h={'100%'} borderRadius={'lg'}
                    overflowY={'hidden'}
                >
                    Messages Here
                </Box>
            </>
        ) : (
            <Box display={'flex'} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                <Text fontSize='3xl' pb={3} fontFamily="Work sans">
                    Click On a User to Start Chatting
                </Text>
            </Box>
        )
      }
    </>
  )
}

export default SingleChat
