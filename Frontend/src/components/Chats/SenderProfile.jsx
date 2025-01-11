import { Box, Center, HStack, Image, Input, Text, VStack } from "@chakra-ui/react"
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
import { useEffect, useState } from "react"
import { useChatState } from "../Context/ChatProvider"
import {
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { IoCameraOutline } from "react-icons/io5"
import axios from "axios"
import { API_BASE_URL } from "../../config"
import toast from "react-hot-toast"

const SenderProfile = ({ user, children }) => {

    return (
        <DialogRoot
            placement={"center"}
            motionPreset="slide-in-bottom"
        >
        <DialogTrigger asChild>
            {
              children ? (<span>{children}</span>) : <button>View Profile</button>
            }
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle textAlign={'center'} fontWeight="medium">{user.name}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Box 
                width='full' display='flex' flexDirection={'column'} justifyContent={'center'} my={5}
                alignItems={'center'} gap={5}
            >
                <Image 
                src={user.profilePic}
                boxSize="100px"
                borderRadius='full'
                alt={user.name}
                />
                <Text>
                  Bio: {user.Bio || "User has No Bio"}
                </Text>
                <Text>
                    Email: {user.email}
                </Text>
            </Box>
          
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Close</Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    )
}

export default SenderProfile
