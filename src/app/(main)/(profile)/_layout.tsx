import { StackHeader } from '@/src/components/StackHeader';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router'


const ProfileStack = () => {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background}, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Profile"} />, headerShown: true }} />
      <Stack.Screen name="editmember" options={{ headerTitle: () => <StackHeader header={"Edit details"} />, headerShown: true }} />
    </Stack>
  )
}

export default ProfileStack