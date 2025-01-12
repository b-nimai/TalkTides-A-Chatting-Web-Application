import { Box, Center, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { API_BASE_URL } from '../../config'
import { PinInput } from "@/components/ui/pin-input"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpVal, setOtpVal] = useState(["", "", "", ""]);
  const [load, setLoad] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async () => {
    setLoad(true);
    if(!email || !password) {
      // Show error toast
      toast.error("Enter email and password ");
      setLoad(false);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/user/login`, 
        { 
          email, 
          password 
        }, 
        { 
          withCredentials: true 
        }
      )
      toast.success("Login Success");
      navigate("/chat");
      setLoad(false);
    } catch (error) {
      toast.error(error.response.data.message)
      setLoad(false)
    }
  };

  const sendOTP = async () => {
    setLoad(true);
    // Simple regex for email validation
    if(!email) {
      toast.error("Enter email first!");
      setLoad(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoad(false)
      return;
    }
    try {
        await axios.post(`${API_BASE_URL}/api/user/sendOtp2`, {
            email
        })
        // Success toast
        toast.success("OTP is send To Your Email!");
        setLoad(false);
    } catch (error) {
        // Show error toast
        toast.error(error.response.data.message);
        setLoad(false);
    }
  }

  const changePassword = async () => {
    setLoad(true);
    if(password !== confirmPassword) {
      toast.error("Password and confirm Password not matched.");
      setLoad(false);
      return;
    }
    const otp = otpVal.join('');
    if(!otp) {
      toast.error("Enter OTP First!");
      setLoad(false);
      return;
    }
    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/user/resetPassword`, {
        email,
        password,
        otp
      })
      toast.success("Password successfully changed.");
      setLoad(false);
      setForgotPassword(!forgotPassword);
    } catch (error) {
      toast.error("Failed to change password.");
      setLoad(false);
    }
  }

  return (
    <VStack px={'12'} color={'black'} >
        {
          forgotPassword ? (
            <>
            <Field label="Email: " required>
              <Box display={'flex'} gap={2} w={'full'}>
                <Input 
                  width={"85%"}
                  value={email}
                  placeholder='Enter your Email'
                  onChange={(e) => setEmail(e.target.value)}
                  fontSize={'xl'}
                  fontFamily={'Work sans'}
                  color={'black'}
                />
                <Button width={"25%"} onClick={sendOTP} loading={load}>
                  Get OTP
                </Button>
              </Box>
            </Field>
            <HStack>
              <Field label="New Password: " required>
                <PasswordInput 
                  value={password}
                  placeholder='Enter your Password'
                  onChange={(e) => setPassword(e.target.value)}
                  fontSize={'xl'}
                  fontFamily={'Work sans'}
                />
              </Field>
              <Field label="Confirm Password: " required>
                <PasswordInput 
                  value={confirmPassword}
                  placeholder='Enter your Password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fontSize={'xl'}
                  fontFamily={'Work sans'}
                />
              </Field>
            </HStack>
            <Field fontSize={'16px'} fontWeight='500' label="Enter OTP: " required>
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
            <Button mt={5} onClick={changePassword}>
              Change Password
            </Button>
            <Button variant="plain" color={'black'} onClick={()=>setForgotPassword(!forgotPassword)}>
              Back to Log In
            </Button>
            </>
          ) : (
            <>
            <Field label="Email: " required>
              <Input 
                value={email}
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                fontSize={'xl'}
                fontFamily={'Work sans'}
                color={'black'}
              />
            </Field>

            <Field label="Password: " required>
              <PasswordInput 
                value={password}
                placeholder='Enter your Password'
                onChange={(e) => setPassword(e.target.value)}
                fontSize={'xl'}
                fontFamily={'Work sans'}
              />
            </Field>

            <Button 
              colorScheme={'blue'}
              width={'50%'}
              style={{marginTop: 15}}
              onClick={loginHandler}
              loadingText="Loging..."
              loading = {load}
            >
              Login
            </Button>

            {/* <Button 
              variant="solid"
              colorScheme='red'
              width={'80%'}
              onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
              }}
            >
              Get Guest User Credentials
            </Button> */}

            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Button variant="plain" color={'black'} fontSize={'lg'} onClick={()=>setForgotPassword(!forgotPassword)}>
                Forgot Password? Reset
              </Button>
            </Box>
            </>
          )
        }
        

        
        
    </VStack>
  )
}

export default Login
