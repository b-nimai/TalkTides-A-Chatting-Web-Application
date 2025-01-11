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

const ProfileModal = ({ children }) => {
  const { user, setUser } = useChatState();
  const [load, setLoad] = useState(false);
  const [pic, setPic] = useState("");
  const [bio, setBio] = useState("");

  // Change Profile Pic
  const ChagngeProfilePic = async() => {}
  const showInput = () => {
    setShowImageInput(!showImageInput);
  }
  const showInput2 = () => {
    setShowTextInput(!showTextInput);
  }

  // Upload image to cloudinary
  const uploadImage = async (pics) => {
    setLoad(true);
    if (!pics || !pics.acceptedFiles || pics.acceptedFiles.length === 0) {
        toast.error("Please upload an image");
        setLoad(false);
        return;
    }

    // Extract the file from acceptedFiles
    const file = pics.acceptedFiles[0];

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Talk_Tide_ChatApp");
        formData.append("cloud_name", "dvvznsplk");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dvvznsplk/image/upload", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                setPic(data.secure_url.toString());
                setLoad(false);
            }
        } catch (error) {
            toast.error("Image upload failed, try again.");
            setLoad(false);
        }
    } else {
        toast.error("Unsupported file type. Please upload a JPEG or PNG image.");
        setLoad(false);
    }
  };
  useEffect(() => {
      if (pic) {
        updateProfile();
      }
  }, [pic]);
  const updateProfile = async() => {
    try {
      const userId = user._id;
      // Api call
      const { data } = await axios.put(`${API_BASE_URL}/api/user/update`, {
        userId,
        pic,
        bio
      }, {
        withCredentials: true
      });
      setUser(data);
      setPic("");
      setBio("");
    } catch (error) {
      toast.error(error.message);
    }
  }

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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <FileUploadRoot accept={["image/png", "image/jpeg"]} onFileChange={uploadImage}>
                    <FileUploadTrigger asChild>
                      <Button 
                        colorPalette="green" b size="sm" mt='-8' height='6' 
                        loading={load}
                      >
                        <IoCameraOutline />
                      </Button>
                    </FileUploadTrigger>
                    {/* <FileUploadList /> */}
                  </FileUploadRoot>
                </div>

                <Text>
                  Bio: {user.Bio || "Add a Bio"}
                </Text>
                
                <Text>
                    Email: {user.email}
                </Text>
            </Box>
            <Box>
              <HStack>
                <Input 
                  placeholder="Write Bio within 50 words"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Button
                onClick={updateProfile}
                >
                  Change Bio
                </Button>
              </HStack>
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
