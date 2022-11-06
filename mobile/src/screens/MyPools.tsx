import { FlatList, Icon, useToast, VStack } from 'native-base'
import { Octicons } from '@expo/vector-icons'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { axiosApi } from '../services/axiosApi'
import { useCallback, useState } from 'react'
import { PoolCard, PoolCardProps } from '../components/PoolCard'
import { Loading } from '../components/Loading'
import { EmptyPoolList } from '../components/EmptyPoolList'

export function MyPools() {
  const [myPools, setMyPools] = useState<PoolCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPools() {
    try {
      const poolsResponse = await axiosApi.get('/pools')

      setMyPools(poolsResponse.data.pools)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Something went wrong getting your pools. Try again later',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools()
    }, []),
  )

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="My pools" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Search pool by code"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate('findpool')}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={myPools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('pooldetails', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            pb: 10,
          }}
          ListEmptyComponent={EmptyPoolList}
        />
      )}
    </VStack>
  )
}
