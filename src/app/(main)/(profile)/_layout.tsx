import { StackHeader } from '@/src/components/StackHeader';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router'


const ProfileStack = () => {
  const { theme } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.primary} }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Profile"} />, headerShown: true }} />
    </Stack>
  )
}

export default ProfileStack