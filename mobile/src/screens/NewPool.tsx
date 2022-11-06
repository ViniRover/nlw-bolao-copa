import { Heading, Text, useToast, VStack } from 'native-base'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'

import Logo from '../assets/logo.svg'
import { useState } from 'react'
import { axiosApi } from '../services/axiosApi'

export function NewPool() {
  const [poolName, setPoolName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  async function handleCreateNewPool() {
    if (!poolName.trim()) {
      return toast.show({
        title: 'Inform a name for your pool.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }

    try {
      setIsLoading(true)
      await axiosApi.post('/pools', {
        title: poolName,
      })
      toast.show({
        title: 'Pool created with success.',
        placement: 'top',
        bgColor: 'green.500',
      })
      setPoolName('')
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Something went wrong, please try again later.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Create new pool" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Create your own world cup pool {'\n'} and share with your friends!
        </Heading>

        <Input
          mb={2}
          placeholder="What's the name of your pool?"
          value={poolName}
          onChangeText={setPoolName}
        />
        <Button
          title="Create pool"
          onPress={handleCreateNewPool}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After creating your pool, you&apos;ll receive a unique code that you
          can use to invite others.
        </Text>
      </VStack>
    </VStack>
  )
}
