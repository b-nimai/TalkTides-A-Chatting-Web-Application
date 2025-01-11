import { Input, VStack } from '@chakra-ui/react'
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { API_BASE_URL } from '../../config'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
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
  return (
    <VStack px={'12'} color={'black'} >
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
        
    </VStack>
  )
}

export default Login
