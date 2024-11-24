import React from 'react'
import { Box, Text } from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"

const UserListItem = ({ user, handleFunction }) => {

  return (
    <Box
        onClick={handleFunction} cursor={'pointer'} bg={'cyan.300'} 
        _hover={{background:'cyan.200'}} width={'100%'} display={'flex'}
        alignItems={'center'} color={'black'} px={3}  py={2} mb={1} 
        borderRadius={'lg'}
    >
      <Avatar 
        mr={2} size={'sm'} cursor='pointer' name={user.name} src={user.profilePic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize='xs'>
            <b>Email: </b>
            {user.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
