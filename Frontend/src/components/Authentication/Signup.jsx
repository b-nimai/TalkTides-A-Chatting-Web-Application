import { HStack, Input, VStack } from '@chakra-ui/react'
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config'

function Signup({ onSignupSuccess }) {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [load, setLoad] = useState(false);


    const submitHandler = async() => {
        setLoad(true);
        if(!name || !email || !password || !confirmPassword ) {
            // use toast for "Fill the required fields"
            toast.error("Fill the required fields")
            setLoad(false);
            return;
        }
        if(password !== confirmPassword) {
            // use Toast 
            toast.error("Password and Confirm Password not matched");
            setLoad(false);
            return;
        }
        // Call signup api
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/user`, {
                name,
                email,
                password,
                confirmPassword,
                pic
            })
            // Success toast
            toast.success("Signup Success");
            setLoad(false);
            onSignupSuccess();
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setPic("")
        } catch (error) {
            console.error("Signup failed due to:", error.message);
            // Show error toast
            toast.error("Signup Failed");
            setLoad(false);
        }
    };
    // Upload image to cloudinary
    const uploadImage = async (pics) => {
        setLoad(true);
        if(pics == undefined) {
            // use toast
            toast.error("Please upload an image")
            setLoad(false);
            return;
        }
        if(pics.type === 'image/jpeg' || pics.type == "image/png") {
            const formData = new FormData();
            formData.append("file", pics);
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
                  console.log(data.secure_url.toString());
                  setLoad(false);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                setLoad(false);
            }
        }
    }

  return (
    <VStack p={'2'} color={'black'} >
        <Field fontSize={'xl'} label="Name: " required>
            <Input 
                placeholder='Enter your Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fontSize={'xl'}
                fontFamily={'Work sans'}
            />
        </Field>

        <Field label="Email: " required>
            <Input 
                placeholder='Enter your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fontSize={'xl'}
                fontFamily={'Work sans'}
                color={'black'}
            />
        </Field>

        <HStack>
            <Field label="Password: " required>
                <PasswordInput 
                    placeholder='Enter your Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fontSize={'xl'}
                    fontFamily={'Work sans'}
                />
            </Field>

            <Field label="Confirm Password: " required>
                <PasswordInput 
                    placeholder='Enter your Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fontSize={'xl'}
                    fontFamily={'Work sans'}
                />
            </Field>
        </HStack>

        <Field label="Upload Your Picture: ">
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                placeholder='Upload a profile pic'
                value={pic}
                onChange={(e) => uploadImage(e.target.files[0])}
                fontSize={'xl'}
                fontFamily={'Work sans'}
            />
        </Field>

        <Button 
            colorScheme={'blue'}
            width={'50%'}
            style={{marginTop: 15}}
            loadingText = "Loading..."
            loading={load}
            onClick={submitHandler}
            colorPalette={"grey"}
        >
            Sign Up
        </Button>
        
    </VStack>
  )
}

export default Signup
