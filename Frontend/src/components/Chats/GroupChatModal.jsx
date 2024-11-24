import React, { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
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
import { Box, Fieldset, Input, Spinner } from '@chakra-ui/react'
import { useChatState } from '../Context/ChatProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import debounce from '../Debounce'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({children}) => {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = useChatState();
    // Search Users Handler
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
    // Create Group Handler
    const createGroupHandler = async() => {
        if(!groupName || !selectedUsers) {
            toast("Fill All the Fields!", {
                icon: '😏'
            })
            return;
        }
        try {
            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            },
            {
                withCredentials:true
            }
        )
        setChats([data, ...chats]);
        // Close Modal
        setOpen(false);
        toast.success("New Group Created Successfully!");
        } catch (e) {
            toast.error(e.response.data);
        }
    }
    // Select User Handler
    const selectHandler = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast("User Already Added!", {
                icon: '🤪'
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    // Delete selected User handler
    const deleteUserHandler = (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter((selected) => selected._id !== userToDelete._id)
        );
    }
    
    return (
        <DialogRoot
            placement={"center"}
            motionPreset="slide-in-bottom"
            lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}
        >
        <DialogTrigger asChild>
            {
                <span>{children}</span>
            }
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle textAlign={'center'} fontWeight="medium" fontFamily="Work sans">
                Create Group
            </DialogTitle>
          </DialogHeader>
          <DialogBody display='flex' flexDir='column' alignItems='center'>
            <Fieldset.Root size="lg" maxW="md" fontFamily="Work sans">
                <Fieldset.Content>
                    <Field>
                      <Input name="name" placeholder='Enter Group Name Here' mb={3}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Input 
    
                        placeholder='Add Users eg: John, Nill, Jane'
            
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearch(search);
                        }}
                      />
                    </Field>
                </Fieldset.Content>
                {/* Show Selected Users */}
                <Box display={'flex'} w={'100%'} flexWrap={'wrap'}>
                    {
                        selectedUsers.map((user) => (
                            <UserBadgeItem 
                                key={user._id} user={user}
                                handleFunction={() => deleteUserHandler(user)}
                            />
                        ))
                    }
                </Box>
                {/* Render search Users */}
                {
                    loading ? <Spinner size="sm" /> : (
                        searchResults.slice(0, 3).map(user => (
                            <UserListItem
                                key={user._id} user={user}
                                handleFunction={() => selectHandler(user)}
                            />
                        ))
                    )
                }
                
            </Fieldset.Root>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" alignSelf="flex-end" onClick={createGroupHandler}>
                Create Group
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    )
}

export default GroupChatModal