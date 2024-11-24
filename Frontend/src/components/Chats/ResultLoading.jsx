import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Stack } from '@chakra-ui/react'

const ResultLoading = () => {
  return (
    <Stack>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
        <Skeleton bg={'cyan.200'} height={10}/>
      </Stack>
  )
}

export default ResultLoading
