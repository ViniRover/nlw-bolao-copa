import { useNavigation } from '@react-navigation/native'
import { Row, Text, Pressable } from 'native-base'

export function EmptyPoolList() {
  const { navigate } = useNavigation()

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        You still didn&apos;t join any pool, how about{' '}
      </Text>

      <Pressable onPress={() => navigate('findpool')}>
        <Text
          textDecorationLine="underline"
          color="yellow.500"
          textDecoration="underline"
        >
          find one using a code
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        or
      </Text>

      <Pressable onPress={() => navigate('newpool')}>
        <Text textDecorationLine="underline" color="yellow.500">
          create a new one
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  )
}
