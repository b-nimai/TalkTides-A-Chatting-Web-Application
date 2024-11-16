import { Box, Image, Input, Text } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const ProfileModal = ({ user, children }) => {
  return (
    <div
    >
        <PopoverRoot 
            positioning={{ 
                placement: "bottom",
                // offset: { crossAxis: 0, mainAxis: 0 } 
            }}
            isCentered={true}
            
        >
            <PopoverTrigger asChild>
                {
                    children ? (<span>{children}</span>) : <button>View Profile</button>
                }
            </PopoverTrigger>
            
                <PopoverContent
                
                    style={{
                        transform: "translate(10%, 40%)"
                    }}
                >
                    <PopoverArrow />
                    <PopoverBody>
                        <PopoverTitle textAlign={'center'} fontWeight="medium">{user.name}</PopoverTitle>
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

                    </PopoverBody>
                </PopoverContent>
            
        </PopoverRoot>
        
    </div>
  )
}

export default ProfileModal
