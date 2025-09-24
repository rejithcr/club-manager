import { StackHeader } from '@/src/components/StackHeader';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router'


const SuperUserStack = () => {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background}, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Super User"} />, headerShown: false }} />
      <Stack.Screen name="clubs" options={{ headerTitle: () => <StackHeader header={"Clubs"} />, headerShown: true }} />
      <Stack.Screen name="users" options={{ headerTitle: () => <StackHeader header={"Users"} />, headerShown: true }} />
      <Stack.Screen name="superuser-editmember" options={{ headerTitle: () => <StackHeader header={"Edit User"} />, headerShown: true }} />
    </Stack>
  )
}

export default SuperUserStack