import React, { useEffect } from 'react'
import { Box, Container, Flex, Text } from "@chakra-ui/react"
import { Tabs } from "@chakra-ui/react"
import { useState } from "react"
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'
import { useChatState } from '../components/Context/ChatProvider'
import { useNavigate } from 'react-router-dom'

function SignupPage() {
  const { isLoggedin } = useChatState();
  const navigate = useNavigate();
  useEffect(()=> {
    if(isLoggedin === true) {
      navigate("/chat")
    }
  },[navigate, isLoggedin])
  const [value, setValue] = useState("first")
  // Callback to switch to the login tab
  const switchToLoginTab = () => {
    setValue("first");
  }

  return (
    <Container maxW='xl' centerContent>
      <Box 
        d='flex' 
        justifyContent= {'center'}
        p={3} 
        backgroundColor="rgba(255, 255, 255, 0.2)"
        w = '100%'
        m="40px 0 15px 0"
        borderRadius={'lg'}
        borderWidth={1}
      
      >
        <Text 
          fontSize='3xl' 
          color={'rgba(255, 255, 255)'} 
          fontFamily={'Work sans'}
          textAlign={'center'}
        >
          TalkTides
        </Text>
      </Box>
      <Box
        backgroundColor="rgba(255, 255, 255, 0.5)"
        w={'100%'}
        p={4}
        borderRadius={'lg'}
        borderWidth={'1px'}
        color={'black'}
      >
        <Tabs.Root 
          value={value} fontFamily={'Work sans'} variant="outline" 
          colorPalette={"green"} fitted textAlign={'center'} 
          fontSize={'2xl'} onValueChange={(e) => setValue(e.value)}
          defaultValue={"first"}
        >
          <Tabs.List>
            <Tabs.Trigger value="first" fontSize={'xl'} color={'black'} w={"50%"} >Login</Tabs.Trigger>
            <Tabs.Trigger value="second"  fontSize={'xl'} color={'black'} w={"50%"}>Sign Up</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first"> 
            <Login />
          </Tabs.Content>
          <Tabs.Content value="second">
            <Signup onSignupSuccess={switchToLoginTab}/>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default SignupPage