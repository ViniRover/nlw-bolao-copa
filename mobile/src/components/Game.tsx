import dayjs from 'dayjs'
import { Button, HStack, Text, useTheme, VStack } from 'native-base'
import { X, Check } from 'phosphor-react-native'
import { getName } from 'country-list'

import { Team } from './Team'

interface GuessProps {
  id: string
  gameId: string
  createdAt: string
  participantId: string
  firstTeamGoals: number
  secondTeamGoals: number
}

export interface GameProps {
  id: string
  date: string
  firstTeamCountryCode: string
  secondTeamCountryCode: string
  guess: null | GuessProps
}

interface Props {
  data: GameProps
  onGuessConfirm: () => void
  setFirstTeamGoals: (value: string) => void
  setSecondTeamGoals: (value: string) => void
}

export function Game({
  data,
  setFirstTeamGoals,
  setSecondTeamGoals,
  onGuessConfirm,
}: Props) {
  const { colors, sizes } = useTheme()
  const gameDate = dayjs(data.date).format('MMMM DD, YYYY HH:00[h]')

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} vs.{' '}
        {getName(data.secondTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {gameDate}
      </Text>

      <HStack
        mt={4}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Team
          teamGoals={data.guess?.firstTeamGoals}
          code={data.firstTeamCountryCode}
          position="right"
          onChangeText={setFirstTeamGoals}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          teamGoals={data.guess?.secondTeamGoals}
          code={data.secondTeamCountryCode}
          position="left"
          onChangeText={setSecondTeamGoals}
        />
      </HStack>

      {!data.guess && (
        <Button
          size="xs"
          w="full"
          bgColor="green.500"
          mt={4}
          onPress={onGuessConfirm}
        >
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      )}
    </VStack>
  )
}
