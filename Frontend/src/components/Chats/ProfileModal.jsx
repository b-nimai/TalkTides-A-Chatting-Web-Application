import { Box, Image, Text } from "@chakra-ui/react"
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

const ProfileModal = ({ user, children }) => {
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

export default ProfileModal
