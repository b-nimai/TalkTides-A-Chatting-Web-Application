import React, { useCallback, useState } from 'react'
import { Box, Fieldset, HStack, Input, Spinner } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useChatState } from '../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import debounce from '../Debounce'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const { user, setSelectedChat, selectedChat } = useChatState();
    const [groupName, setGroupName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    
    // Handle Rename
    const handleRename = async() => {
        if(!groupName) {
            toast("Enter a name!", {
                icon: '🧐'
            })
            return;
        }
        try {
            setRenameLoading(true);
            const { data } = await axios.put('http://localhost:5000/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupName
            }, {
                withCredentials: true
            });
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setGroupName("")
            setRenameLoading(false);
            toast.success("Group Rename Successfull!")
        } catch (e) {
            toast.error("Group Rename Failed!");
            setRenameLoading(false);
            setGroupName("")
        }
    }
    // Handle Search
    const handleSearch = useCallback(
        debounce(async(query) => {
            if(!query) {
                return;
            }
            try {
                setLoading(true);
                const {data} = await axios.get(`http://localhost:5000/api/user?search=${query}`,
                  {
                    withCredentials: true
                  }
                )
                console.log(data)
                setLoading(false);
                setSearchResults(data)
            } catch (error) {
                setLoading(false)
                toast.error("Unabale to Search")
            }
        }, 500),// 500 ms Delay
        []
    );

    // Add to group
    const selectHandler = async(userToAdd) => {
        if(selectedChat.users.find((user) => user._id === userToAdd._id)) {
            toast("User Already in the Group!", {
                icon: '🤪'
            })
            return;
        }
        // Check for Admin
        if(selectedChat.groupAdmin._id !== user._id) {
            toast("You are not Admin!", {
                icon:'🤭'
            })
            return;
        }
        // try catch
        try {
            setLoading(true);
            const { data } = await axios.put("http://localhost:5000/api/chat/add", {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, {
                withCredentials: true
            })
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to add the user, try again!");
            setLoading(false);
        }
    }

    // Remove user From group 
    const removeUserHandler = async(userToremove) => {
        // Check for admin
        if(selectedChat.groupAdmin._id !== user._id) {
            toast("Only Admin can remove group member!", {
                icon: '🤕'
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put("http://localhost:5000/api/chat/remove", {
                chatId: selectedChat._id,
                userId: userToremove._id
            }, {
                withCredentials: true
            })
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to remove user, try again!");
            setLoading(false);
        }
    }

    // Leave Group Handler
    const handeLeaveGroup = async(userToremove) => {
        try {
            setLoading(true);
            const { data } = await axios.put("http://localhost:5000/api/chat/remove", {
                chatId: selectedChat._id,
                userId: userToremove._id
            }, {
                withCredentials: true
            })
            setSelectedChat();
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to leave the group, try again!");
            setLoading(false);
        }
    }
  return (
        <DialogRoot
            placement={"center"}
            motionPreset="slide-in-bottom"
        >
        <DialogTrigger asChild>
            <Button>
                <i className="fa-solid fa-users"></i>
            </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle textAlign={'center'} fontWeight="medium">{selectedChat.chatName}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Box 
                width='full' display='flex' justifyContent={'center'} my={1}
                alignItems={'center'} gap={1}
            >
                {selectedChat.users.map((user) => (
                    <UserBadgeItem 
                        key={user._id} user={user}
                        handleFunction={() => removeUserHandler(user)}
                    />
                ))}
            </Box>

            {/* Form for Renaming Group */}

            <Fieldset.Root size="lg" maxW="md" fontFamily="Work sans">
                <Fieldset.Content>
                    <HStack display={"flex"} alignItems={'center'} justifyContent={'center'}>
                        <Field>
                          <Input name="name" placeholder='Enter Group Rename Here' 
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                          />
                        </Field>
                        <Button
                            ml={4}
                            loading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </HStack>

                    <Field>
                        <Input name="name" placeholder='Add User to Group' 
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Field>
                </Fieldset.Content>
            </Fieldset.Root>
            {/* Render searched users */}
            {
                loading ? (
                    <Spinner size="sm" />
                ) : (
                    searchResults.slice(0, 3).map(user => (
                        <UserListItem
                            key={user._id} user={user}
                            handleFunction={() => selectHandler(user)}
                        />
                    ))
                )
            }

          </DialogBody>
          <DialogFooter>
            <Button onClick={() => handeLeaveGroup(user)} bg={'red'}>
                Leave Group
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    )
}

export default UpdateGroupChatModal
