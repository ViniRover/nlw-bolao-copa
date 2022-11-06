import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'

import { MyPools } from '../screens/MyPools'
import { NewPool } from '../screens/NewPool'
import { FindPool } from '../screens/FindPool'
import { PoolDetails } from '../screens/PoolDetails'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        },
      }}
    >
      <Screen
        name="newpool"
        component={NewPool}
        options={{
          tabBarIcon: ({ color }) => (
            <PlusCircle color={color} size={sizes[6]} />
          ),
          tabBarLabel: 'New pool',
          tabBarAccessibilityLabel: 'Create new pool',
        }}
      />
      <Screen
        name="mypools"
        component={MyPools}
        options={{
          tabBarIcon: ({ color }) => (
            <SoccerBall color={color} size={sizes[6]} />
          ),
          tabBarLabel: 'My pools',
          tabBarAccessibilityLabel: 'Show my pools',
        }}
      />
      <Screen
        name="findpool"
        component={FindPool}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Screen
        name="pooldetails"
        component={PoolDetails}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  )
}
