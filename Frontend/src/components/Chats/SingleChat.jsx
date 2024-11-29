import React, { useEffect, useState } from 'react'
import { useChatState } from '../Context/ChatProvider';
import { Box, Input, Spinner, Text } from '@chakra-ui/react';
import { Button } from "@/components/ui/button"
import { getSender, getSenderFull } from './GetSender';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import {API_BASE_URL} from '../../config'
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, setSelectedChat, selectedChat } = useChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    // Fetch messages handler
    const fetchMessageHanlder = async() => {
        if(!selectedChat) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/api/message/${selectedChat._id}`, {
                withCredentials: true
            })
            
            setMessages(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load message!");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessageHanlder();
    }, [selectedChat]);

    // Send Message Handler
    const sendMessageHandler = async(event) => {
        if(event.key === "Enter" && newMessage) {
            event.preventDefault();
            try {
                const { data } = await axios.post(`${API_BASE_URL}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, {
                    withCredentials: true
                })
                console.log(data);
                setNewMessage("");
                setMessages([...messages, data]);
                toast.success("Message send")
            } catch (error) {
                toast.error("Failer to send message, try again.")
            }
        }
    };
    // Typing Handler
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator logic
    };
    

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
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                                    fetchMessageHanlder={fetchMessageHanlder}
                                />

                            </>
                        )
                    }

                </Text>
                <Box
                    display={"flex"} flexDirection={'column'} justifyContent={'flex-end'}
                    p={3} bg={"rgba(232, 232, 232, 0.5)"} w={'100%'} h={'100%'} borderRadius={'lg'}
                    overflowY={'hidden'}
                >
                    {/* Messages Here */}
                    {
                        loading ? (
                            <Spinner 
                                size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'}
                            />
                        ) : (
                            <Box
                                display={"flex"} flexDir={'column'} overflowY={'scroll'}
                                scrollbarWidth={'none'}
                            >
                                <ScrollableChat messages={messages} />
                            </Box>
                        )
                    }
                    <Box mt={3}>
                        <form onKeyDown={sendMessageHandler} >
                            <Input 
                                variant={'filled'}
                                bg={"rgba(255, 255, 255, 1)"}
                                placeholder='Enter message here...'
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </form>
                    </Box>
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
