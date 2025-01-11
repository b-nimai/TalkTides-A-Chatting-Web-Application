import { Box, Center, HStack, Input, VStack } from '@chakra-ui/react'
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config'
import { PinInput } from "@/components/ui/pin-input"

function Signup({ onSignupSuccess }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [load, setLoad] = useState(false);
    const [otpSend, isOtpSend] = useState(false);
    const [otpVal, setOtpVal] = useState(["", "", "", ""]);

    // Send otp 
    const sendOtp = async()=> {
        setLoad(true);
        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
          toast.error("Please enter a valid email address.");
          setLoad(false)
          return;
        }
        if(!firstName || !email || !password || !confirmPassword ) {
            // use toast for "Fill the required fields"
            toast.error("Fill the required fields")
            setEmail("")
            setLoad(false);
            return;
        }
        if(password !== confirmPassword) {
            // use Toast 
            toast.error("Password and Confirm Password not matched");
            setLoad(false);
            return;
        }
        // API call to send otp
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/user/sendOtp`, {
                firstName,
                email,
                password,
                confirmPassword
            })
            // Success toast
            toast.success("OTP send Success!");
            isOtpSend(true);
            setLoad(false);
        } catch (error) {
            // Show error toast
            toast.error(error.response.data.message);
            setLoad(false);
        }
    }

    const submitHandler = async() => {
        setLoad(true);

        if(!firstName || !email || !password || !confirmPassword ) {
            // use toast for "Fill the required fields"
            toast.error("Fill the required fields")
            setEmail("")
            setLoad(false);
            return;
        }
        if(password !== confirmPassword) {
            // use Toast 
            toast.error("Password and Confirm Password not matched");
            setLoad(false);
            return;
        }
        const otp = otpVal.join('');
        // Call signup api
        try {
            await axios.post(`${API_BASE_URL}/api/user`, {
                firstName,
                lastName,
                email,
                password,
                otp
            })
            // Success toast
            toast.success("Signup Success");
            setLoad(false);
            onSignupSuccess();
            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setOtpVal(["", "", "", ""]);
        } catch (error) {
            // Show error toast
            toast.error(error.response.data.message);
            setLoad(false);
        }
    };
    
    
  return (
    <VStack p={'2'} color={'black'} >
        {!otpSend ? (
            <>
                <HStack>
                    <Field fontSize={'xl'} label="First Name: " required>
                        <Input 
                            placeholder='Enter your First Name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fontSize={'xl'}
                            fontFamily={'Work sans'}
                        />
                    </Field>
                    <Field fontSize={'xl'} label="Last Name: " required>
                        <Input 
                            placeholder='Enter your Last Name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fontSize={'xl'}
                            fontFamily={'Work sans'}
                        />
                    </Field>
                </HStack>

                <Field label="Email: " required>
                    <Input 
                        type='email'
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

                {/* <Field label="Upload Your Picture: ">
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
                </Field> */}

                <Button 
                    colorScheme={'blue'}
                    width={'50%'}
                    style={{marginTop: 15}}
                    loadingText = "Signing up..."
                    loading={load}
                    onClick={sendOtp}
                    colorPalette={"grey"}
                >
                    Sign Up
                </Button>
            </>
        ) : (
            <>
                <Field fontSize={'16px'} fontWeight='500' label="Enter OTP: " required>
                    {/* <Input
                        placeholder='Enter OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fontSize={'xl'}
                        fontFamily={'Work sans'}
                    /> */}
                    <Center w={'full'} >
                        <PinInput 
                            size="lg"
                            fontSize={'xl'}
                            fontFamily={'Work sans'}
                            value={otpVal}
                            onValueChange={(e) => setOtpVal(e.value)}
                        />
                    </Center>
                </Field>
                <Button
                    colorScheme={'green'}
                    width={'50%'}
                    style={{ marginTop: 15 }}
                    loadingText = "verifing..."
                    loading={load}
                    onClick={submitHandler}
                >
                    Verify OTP
                </Button>
            </>
        )}
        
    </VStack>
  )
}

export default Signup
