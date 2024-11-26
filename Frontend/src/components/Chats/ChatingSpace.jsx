import React from 'react'
import { useChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

function ChatingSpace({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useChatState();
  return (
    <Box
      display={{base: selectedChat ? "flex" : "none", md: 'flex'}}
      alignItems={"center"} flexDirection={'column'} p={3} w={{base: "100%", md: '68%'}}
      bg={'rgba(255, 255, 255, 0.5)'} color={'black'} borderRadius={"lg"} borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatingSpace
