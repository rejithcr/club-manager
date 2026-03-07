import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { ClubContext } from "../context/ClubContext";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { SnackbarProvider } from "../components/snackbar/SnackbarProvider";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  const [theme, setTheme] = useState<any | undefined>(undefined);
  const [clubInfo, setClubInfo] = useState<any | undefined>(undefined);

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <SnackbarProvider />
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
          <ClubContext.Provider value={{ clubInfo, setClubInfo }}>
            <InitialiseApp memberId={userInfo?.memberId} setClubInfo={setClubInfo}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
              </Stack>
            </InitialiseApp>
          </ClubContext.Provider>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  );
}

function InitialiseApp({
  children,
  memberId,
  setClubInfo,
}: {
  children: React.ReactNode;
  memberId: number | undefined;
  setClubInfo: (info: any) => void;
}) {
  const router = useRouter();

  const handleNotificationTap = useCallback(
    (data: { targetType?: string; targetId?: string; clubId?: string; clubName?: string }) => {
      // Seed ClubContext so club-scoped screens work even on cold start
      if (data.clubId && data.clubName) {
        setClubInfo({ clubId: Number(data.clubId), clubName: data.clubName });
      }

      switch (data.targetType) {
        case 'EVENT':
          if (data.targetId) {
            router.push(`/(main)/(clubs)/(events)/eventdetails?eventId=${data.targetId}`);
          } else {
            router.push('/(main)/notifications');
          }
          break;
        case 'BIRTHDAY':
        case 'GENERAL':
          router.push('/(main)');
          break;
        case 'FEE':
          router.push('/(main)/(clubs)/(fees)');
          break;
        case 'SPLIT':
          router.push('/(main)/(clubs)/(fees)/adhocfee');
          break;
        case 'MEMBERSHIP_REQUEST':
          router.push('/(main)/(clubs)/membershiprequests');
          break;
        case 'MEMBERSHIP_APPROVAL':
          if (data.targetId) {
            router.push(`/(main)/(clubs)/(members)/memberdetails?memberId=${data.targetId}`);
          } else {
            router.push('/(main)/notifications');
          }
          break;
        default:
          router.push('/(main)/notifications');
          break;
      }
    },
    [router, setClubInfo]
  );

  usePushNotifications(memberId, handleNotificationTap);
  return <>{children}</>;
}
