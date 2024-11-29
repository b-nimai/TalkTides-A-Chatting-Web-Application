import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, showProfilePic } from './GetSender'
import { Avatar } from "@/components/ui/avatar"
import { useChatState } from '../Context/ChatProvider';
import { Tooltip } from "@/components/ui/tooltip"
const ScrollableChat = ({messages}) => {
  const { user } = useChatState();
  
  return (
    <ScrollableFeed>
      {
        messages && messages.map((m, i) => {
          // console.log('isSameSender:', isSameSender(messages, m, i, user._id));
          // console.log('isLastMessage:', isLastMessage(messages, i, user._id));
        return (
          <div style={{display: 'flex'}} key={m._id}>
            {
              // (isSameSender(messages, m, i, user._id) ||
              // isLastMessage(messages, i, user._id)) 
              (showProfilePic(messages, m, i, user._id))
              && (
              <Tooltip
                label={m.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar 
                  mt='7px' mr={1} size='sm' cursor='pointer' name={m.sender.name} 
                  src={m.sender.profilePic}
                />
              </Tooltip>
            )}
            <span 
              style={{
                background: `${
                  m.sender._id === user._id ? "#7FFFC1" : "#7FFFFF"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: '20px',
                padding: "8px 12px",
                maxWidth: "75%",
                alignSelf: `${m.sender._id === user._id ? "flex-end" : "flex-start"}`
              }}
            >
              {m.content}
            </span>
          </div>
          );
        })
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
