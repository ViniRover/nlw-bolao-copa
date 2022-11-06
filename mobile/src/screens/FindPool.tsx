import { useNavigation } from '@react-navigation/native'
import { Heading, useToast, VStack } from 'native-base'
import { useState } from 'react'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { axiosApi } from '../services/axiosApi'

export function FindPool() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPool() {
    try {
      if (!code.trim()) {
        return toast.show({
          title: 'Please, inform the code.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
      setIsLoading(true)
      await axiosApi.post('/pools/join', {
        code,
      })

      toast.show({
        title: 'You joined the pool. Have fun!',
        placement: 'top',
        bgColor: 'green.500',
      })
      setIsLoading(false)
      navigate('mypools')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      if (error.response?.data?.message) {
        toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Something went wrong. Try again later.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Search by code" showBackButton={true} />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Find a pool using your unique code
        </Heading>

        <Input
          mb={2}
          placeholder="What's the pool code?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />
        <Button
          title="Join pool"
          onPress={handleJoinPool}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  )
}
