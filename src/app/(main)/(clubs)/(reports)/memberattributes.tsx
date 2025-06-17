import { Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import ThemedButton from '@/src/components/ThemedButton'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { ClubContext } from '@/src/context/ClubContext'
import { jsonToCSV } from '@/src/utils/common'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { appStyles } from '@/src/utils/styles'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { useHttpGet } from '@/src/hooks/use-http'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubMemberAttribute } from '@/src/types/member'
import Spacer from '@/src/components/Spacer'
import Chip from '@/src/components/Chip'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { getClubMemberAttributesReport } from '@/src/helpers/club_helper'
import Alert, { AlertProps } from '@/src/components/Alert'


const MemberAttributes = () => {
    const { clubInfo } = useContext(ClubContext);
    const [isReportFetching, setIsReportFetching] = React.useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const {
        data: cmaList,
        isLoading: isLoadingCMA,
        setData: setCmaList
    } = useHttpGet("/club/report/memberattribute", { clubId: clubInfo.clubId, getClubMemberAttribute: true })

    const exportDataToCSV = async (data: any[], filename: string) => {
        try {
            const csvString = jsonToCSV(data);
            if (Platform.OS === 'web') {
                const blob = new Blob([csvString], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                const fileUri = FileSystem.documentDirectory + filename;
                await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    console.log("Sharing is not available on this device");
                }
            }
        } catch (error) {
            alert("Error! " + error);
        }
    }


    const handleExport = () => {
        setIsReportFetching(true);
        getClubMemberAttributesReport(clubInfo.clubId, cmaList.filter((cma: ClubMemberAttribute) => cma.selected).map((cma: ClubMemberAttribute) => cma.clubMemberAttributeId))
            .then(response => {
                console.log(response.data);
                exportDataToCSV(response.data, clubInfo.clubName + ' - member attributes.csv')
            })
            .catch(error => setAlertConfig({
                visible: true, title: 'Error', message: error.response.data.error,
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            }))
            .finally(() => setIsReportFetching(false));
    }

    const handleSelection = (clubMemberAttributeId: number) => {
        setCmaList((prevCMAList: ClubMemberAttribute[]) => {
            const updatedCMAList = prevCMAList.map((cma: ClubMemberAttribute) => {
                if (cma.clubMemberAttributeId === clubMemberAttributeId) {
                    return { ...cma, selected: !cma.selected };
                }
                return cma;
            });
            return updatedCMAList;
        });
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <ScrollView>
                    <ThemedText style={{ ...appStyles.heading }}>Select Attributes</ThemedText>
                    <Spacer space={6} />
                    {isLoadingCMA ? (
                        <LoadingSpinner />
                    ) : (
                        <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignSelf: 'center', width: "80%" }}>
                            {cmaList?.map((cma: ClubMemberAttribute) => (
                                <Chip key={cma.clubMemberAttributeId} selected={cma.selected} onPress={() => handleSelection(cma.clubMemberAttributeId)}>
                                    <ThemedText>{cma.attribute}</ThemedText>
                                </Chip>
                            ))}
                        </ThemedView>
                    )}
                    <Spacer space={20} />
                    {!(isLoadingCMA || isReportFetching) && <ThemedButton title=' Export ' onPress={() => handleExport()} />}
                    <Spacer space={20} />
                </ScrollView>
                {alertConfig?.visible && <Alert {...alertConfig} />}
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default MemberAttributes

function setAlertConfig(arg0: { visible: boolean; title: string; message: any; buttons: { text: string; onPress: () => any }[] }): any {
    throw new Error('Function not implemented.')
}
