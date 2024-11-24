import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
        px={2} py={1} borderRadius={'lg'} m={1} mb={2} fontFamily={'Work sans'}
        fontSize={12} bgColor={'purple'} cursor={'pointer'} onClick={handleFunction}
        display={'flex'} alignItems={'center'} gap={2} flexWrap={'wrap'}
    >
        {user.name}
        <i className="fa-solid fa-xmark"></i>
    </Box>
  )
}

export default UserBadgeItem
