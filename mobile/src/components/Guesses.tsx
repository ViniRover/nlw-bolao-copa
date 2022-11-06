import { useFocusEffect } from '@react-navigation/native'
import { Box, FlatList, useToast } from 'native-base'
import { useCallback, useState } from 'react'
import { axiosApi } from '../services/axiosApi'
import { EmptyMyPoolList } from './EmptyMyPoolList'
import { Game, GameProps } from './Game'
import { Loading } from './Loading'

interface Props {
  poolId: string
  code: string
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamGoals, setFirstTeamGoals] = useState('')
  const [secondTeamGoals, setSecondTeamGoals] = useState('')
  const [games, setGames] = useState<GameProps[]>([])
  const toast = useToast()

  async function handleCreateGuess(gameId: string) {
    try {
      if (!firstTeamGoals.trim() || !secondTeamGoals.trim()) {
        return toast.show({
          title: 'You need to inform the score for both teams.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await axiosApi.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamGoals: Number(firstTeamGoals),
        secondTeamGoals: Number(secondTeamGoals),
      })

      toast.show({
        title: 'You guess was saved successfully. Good luck!',
        placement: 'top',
        bgColor: 'green.500',
      })

      fetchGames()
    } catch (error) {
      if (error.response?.data?.message) {
        toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Something went wrong with your guess. Try again later.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }
  }

  async function fetchGames() {
    try {
      setIsLoading(true)
      const gamesResponse = await axiosApi.get(`/pools/${poolId}/games`)
      setGames(gamesResponse.data.games)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Something went wrong getting all games. Try again later.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchGames()
    }, [poolId]),
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Game
            data={item}
            setFirstTeamGoals={setFirstTeamGoals}
            setSecondTeamGoals={setSecondTeamGoals}
            onGuessConfirm={() => handleCreateGuess(item.id)}
          />
        )}
        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
      />
    </Box>
  )
}
