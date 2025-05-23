import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useChatState } from '../Context/ChatProvider';
import { Box, Input, Spinner, Text, Textarea } from '@chakra-ui/react';
import { Button } from "@/components/ui/button"
import { getSender, getSenderFull } from './GetSender';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import {API_BASE_URL} from '../../config'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'
import SenderProfile from './SenderProfile';
import { formatDistanceToNow, format } from 'date-fns';

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, setSelectedChat, selectedChat, notification, setNotification } = useChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const textareaRef = useRef(null);
    const [senderDetails, setsenderDetails] = useState(null);


    // Lottie Option
    const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};
    // Connect to socket.io
    useEffect(() => {
        // Initialize socket connection
        socket = io('https://talktides.onrender.com', {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.emit("setup", user);
        socket.on('Connected', () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // Cleanup on component unmount to disconnect socket
        return () => {
            // socket.disconnect();
            socket.off();
        }
    }, [user]);

    // Fetch messages handler
    const fetchMessageHanlder = useCallback(async() => {
        if(!selectedChat) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/api/message/${selectedChat._id}`, {
                withCredentials: true
            })
            
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast.error("Failed to load message!");
            setLoading(false);
        }
    }, [selectedChat]);

    useEffect(() => {
        fetchMessageHanlder();
        selectedChatCompare = selectedChat;
        // setsenderDetails(getSenderFull(user, selectedChat?.users));
    }, [selectedChat, fetchMessageHanlder]);

    // Checking if new message received
    useEffect(() => {
        socket.on("message received", (newMessageRecived) => {
            if( !selectedChatCompare || 
                selectedChatCompare._id !== newMessageRecived.chat._id
            ) {
                // Give notification
                if(!notification.includes(newMessageRecived)) {
                    setNotification([newMessageRecived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecived]);
            }
            const markNotificationsAsRead = async () => {
                try {
                    for (const notify of notification) {
                        if (selectedChat === notify.chat._id) {
                            await axios.put(
                                `${API_BASE_URL}/api/notification/markAsRead`,
                                { notificationId: notify._id },
                                { withCredentials: true }
                            );
                        }
                    }
                    setFetchAgain((prev) => !prev);
                } catch (error) {
                    console.error("Error marking notifications as read:", error);
                }
            };

            if (notification.length > 0) {
                markNotificationsAsRead();
            }
        });
        return () => socket.off("message received");
    }, [notification, selectedChatCompare, fetchAgain, setNotification, setFetchAgain]);

    // useEffect(() => {
    //     const markNotificationsAsRead = async () => {
    //         try {
    //             for (const notify of notification) {
    //                 if (selectedChat === notify.chat._id) {
    //                     await axios.put(
    //                         `${API_BASE_URL}/api/notification/markAsRead`,
    //                         { notificationId: notify._id },
    //                         { withCredentials: true }
    //                     );
    //                 }
    //             }
    //             setFetchAgain((prev) => !prev);
    //         } catch (error) {
    //             console.error("Error marking notifications as read:", error);
    //         }
    //     };

    //     if (notification.length > 0) {
    //         markNotificationsAsRead();
    //     }
    // }, [notification, selectedChat]);


    // Send Message Handler
    const sendMessageHandler = async(event) => {
        if(!newMessage.trim()) {
            setNewMessage("");
            setLoad(false);
            return;
        }
        if(event.key === "Enter" && newMessage.trim()) {
            setLoad(true);
            event.preventDefault();
            socket.emit("stop typing", selectedChat._id);
            try {
                const { data } = await axios.post(`${API_BASE_URL}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, {
                    withCredentials: true
                })
                socket.emit("new message", data);
                setNewMessage("");
                setMessages((prevMessages) => [...prevMessages, data]);
                // toast.success("Message send.")
                textareaRef.current?.focus();
                setLoad(false);
            } catch (error) {
                setNewMessage("");
                setLoad(false);
                toast.error("Failer to send message, try again.")
            }
        }
    };

    const sendMessageHandlerWithButton = async(e) => {
        setLoad(true);
        e.preventDefault();
        if(newMessage.trim()) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const { data } = await axios.post(`${API_BASE_URL}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, {
                    withCredentials: true
                })
                
                socket.emit("new message", data);
                setNewMessage("");
                setMessages((prevMessages) => [...prevMessages, data]);
                // toast.success("Message Send.")
                textareaRef.current?.focus();
                setLoad(false);
            } catch (error) {
                setNewMessage("");
                setLoad(false);
                toast.error("Failer to send message, try again.")
            }
        }
    };

    // Typing Handler
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator logic
        if(!socketConnected) return;
        if(!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    
    };

    // Format date
    const formatLastSeen = (lastSeen) => {
        const date = new Date(lastSeen);

        const diffInMinutes = (Date.now() - date.getTime()) / 60000;

        if (diffInMinutes < 1) {
            return "Just now";
        }

        if (diffInMinutes < 1440) {
            // Less than 1 day ago
            return formatDistanceToNow(date, { addSuffix: true }); // e.g., "5 minutes ago"
        }

        return format(date, "PPpp"); // e.g., "May 22, 2025 at 4:30 PM"
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
                               {senderDetails && senderDetails.isOnline ? (
                                        <i className="fa-solid fa-circle" style={{color: 'green', fontSize: '10px'}}></i>
                                    ) : (
                                              <Text>Last Seen: {formatLastSeen(getSenderFull(user, selectedChat.users).lastSeen)}</Text>
                                    )
                                }

                               <SenderProfile user={getSenderFull(user, selectedChat.users)}>
                                    <Button
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        borderRadius="50%" // Make the button circular
                                        overflow="hidden"  // Ensure the image does not overflow
                                        width="50px"       // Set the desired width
                                        height="50px"      // Set the desired height
                                        padding="0" 
                                    >
                                        <img 
                                            src={getSenderFull(user, selectedChat.users).profilePic}
                                            style={{
                                                width: "100%",   // Make the image fill the button
                                                height: "100%",  // Ensure the image covers the button area
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Button>
                                </SenderProfile>
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
                    p={1} bg={"rgba(232, 232, 232, 0.5)"} w={'100%'} h={'100%'} borderRadius={'lg'}
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
                            {isTyping && <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={20}
                                    style={{marginBottom: 0, marginLeft: 0}} 
                                />
                            </div>}
                            <Box 
                                display={'flex'} gap={1} alignItems={'center'}
                                position='sticky'
                                buttom={0}
                                zIndex={1000}
                            >
                                <Textarea 
                                    ref={textareaRef}
                                    bg={"rgba(255, 255, 255, 1)"}
                                    placeholder='Type your message...'
                                    value={newMessage}
                                    onChange={typingHandler}
                                    size={'sm'}
                                    rows={1}
                                    flex='1'
                                    resize={'none'}
                                    maxHeight='200px'
                                    // overflow={'hidden'}
                                    _focus={{outline: 'none'}}
                                />
                                <Button 
                                    loading={load}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={sendMessageHandlerWithButton}
                                >
                                    <i className="fa-regular fa-paper-plane"></i>
                                </Button>
                            </Box>
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
