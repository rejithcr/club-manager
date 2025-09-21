import { Platform, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ThemedButton from '@/src/components/ThemedButton';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { ClubContext } from '@/src/context/ClubContext';
import { jsonToCSV } from '@/src/utils/common';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { ClubMemberAttribute } from '@/src/types/member';
import Spacer from '@/src/components/Spacer';
import Chip from '@/src/components/Chip';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MemberAttributesEdit from './memberattributesedit';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';
import { useGetClubMemberReportableAttributesQuery, useLazyGetClubMemberAttributesReportQuery } from '@/src/services/clubApi';
import { showSnackbar } from '@/src/components/snackbar/snackbarService';

export default function MemberAttributes() {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          <TouchableOpacity style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent:"space-between", alignItems: "center"}}>
              <ThemedHeading style={{width: 200}}>Select Attributes</ThemedHeading>
              {!isEdit ?<ThemedIcon name='MaterialCommunityIcons:square-edit-outline' size={25} onPress={() => setIsEdit(true)}/> : 
                <ThemedIcon name='AntDesign:back' size={25} onPress={() => setIsEdit(false)}/>}
          </TouchableOpacity>   
          {isEdit ? <MemberAttributesEdit /> : <MemberAttributesExport />}
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
}

const MemberAttributesExport = () => {
  const { clubInfo } = useContext(ClubContext);
  const [isReportFetching, setIsReportFetching] = React.useState(false)
  const [cmaList, setCmaList] = React.useState<ClubMemberAttribute[]>([]);
  const {
    data,
    isLoading: isLoadingCMA,
  } = useGetClubMemberReportableAttributesQuery({ clubId: clubInfo.clubId, getClubMemberAttribute: true })

  useEffect(()=>{
    if(data){
      setCmaList(data)
    }
  }, [data]);

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
        const file = new File(Paths.document, filename);
        file.write(csvString);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri);
        } else {
          console.log("Sharing is not available on this device");
        }
      }
    } catch (error) {
      alert("Error! " + error);
    }
  }

  const [getClubMemberAttributesReport] = useLazyGetClubMemberAttributesReportQuery();
  const handleExport = async () => {
    try {
      const clubMemberAttributeIds = cmaList.filter((cma) => cma.selected).map((cma) => cma.clubMemberAttributeId);
      if(clubMemberAttributeIds.length === 0){
        showSnackbar("Please select at least one attribute to export");
        return;
      }
      setIsReportFetching(true);
      const response = await getClubMemberAttributesReport({
        clubId: clubInfo.clubId,
        clubMemberAttributeIds: clubMemberAttributeIds.join(","),
      }).unwrap();
      console.log(response)
      exportDataToCSV(response, clubInfo.clubName + " - member attributes.csv");
    } finally {
      setIsReportFetching(false);
    }
  };

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
    <>
      <Spacer space={6} />
      {isLoadingCMA ? (
        <LoadingSpinner />
      ) : (
        <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignSelf: 'center', width: "85%" }}>
          {cmaList?.map((cma: ClubMemberAttribute) => (
            <Chip key={cma.clubMemberAttributeId} selected={cma.selected} onPress={() => handleSelection(cma.clubMemberAttributeId)}>
              <ThemedText>{cma.attribute}</ThemedText>
            </Chip>
          ))}
        </ThemedView>
      )}
      <Spacer space={20} />
      {isReportFetching && <LoadingSpinner />}
      {!(isLoadingCMA || isReportFetching) && <ThemedButton title=' Export ' onPress={() => handleExport()} />}
      <Spacer space={20} />
    </>
  )
}

