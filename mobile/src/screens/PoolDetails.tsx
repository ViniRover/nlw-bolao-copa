import { useRoute } from '@react-navigation/native'
import { HStack, useToast, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import { Share } from 'react-native'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Guesses } from '../components/Guesses'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Option } from '../components/Option'
import { PoolCardProps } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { axiosApi } from '../services/axiosApi'

interface RouteParams {
  id: string
}

export function PoolDetails() {
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses',
  )
  const toast = useToast()
  const route = useRoute()
  const { id } = route.params as RouteParams

  async function getPoolDetails() {
    try {
      const poolResponse = await axiosApi.get(`/pools/${id}`)
      setPoolDetails(poolResponse.data.pool)
    } catch (error) {
      console.log(error)
      toast.show({
        title:
          'Something went wrong getting the pool details. Try again later.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    })
  }

  useEffect(() => {
    getPoolDetails()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails?.title}
        showShareButton={true}
        showBackButton={true}
        handleCodeShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 1 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Your guesses"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  )
}
