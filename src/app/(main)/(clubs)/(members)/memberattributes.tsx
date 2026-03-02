import { Platform, TouchableOpacity, View } from 'react-native';
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
import { useTheme } from '@/src/hooks/use-theme';

export default function MemberAttributes() {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          <TouchableOpacity style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent:"space-between", alignItems: "center"}}>
              <ThemedHeading style={{width: 200}}>Select Attributes</ThemedHeading>
              {!isEdit ?<ThemedIcon name='MaterialCommunityIcons:square-edit-outline' size={25} onPress={() => setIsEdit(true)}/> : 
                <ThemedIcon name='Ionicons:return-up-back' size={25} onPress={() => setIsEdit(false)}/>}
          </TouchableOpacity>   
          {isEdit ? <MemberAttributesEdit /> : <MemberAttributesExport />}
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
}

const MemberAttributesExport = () => {
  const { clubInfo } = useContext(ClubContext);
  const { colors } = useTheme();
  const [isReportFetching, setIsReportFetching] = React.useState(false)
  const [cmaList, setCmaList] = React.useState<ClubMemberAttribute[]>([]);
  const [reportData, setReportData] = React.useState<any[]>([]);
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
        file.write(csvString); // this is working. Not sure why showing error
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
  
  const handleFetchReport = async () => {
    try {
      const clubMemberAttributeIds = cmaList.filter((cma) => cma.selected).map((cma) => cma.clubMemberAttributeId);
      if(clubMemberAttributeIds.length === 0){
        showSnackbar("Please select at least one attribute to fetch report");
        return;
      }
      setIsReportFetching(true);
      const response = await getClubMemberAttributesReport({
        clubId: clubInfo.clubId,
        clubMemberAttributeIds: clubMemberAttributeIds.join(","),
      }).unwrap();
      setReportData(response);
    } catch (error) {
      showSnackbar("Error fetching report", "error");
      console.error(error);
    } finally {
      setIsReportFetching(false);
    }
  };

  const handleExport = async () => {
    try {
      if(reportData.length === 0){
        showSnackbar("No data to export");
        return;
      }
      exportDataToCSV(reportData, clubInfo.clubName + " - member attributes.csv");
    } catch (error) {
      showSnackbar("Error exporting data", "error");
      console.error(error);
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
      <Spacer space={10} />
      {isReportFetching && <LoadingSpinner />}
      {!(isLoadingCMA || isReportFetching) && (
        <ThemedButton title='Fetch Report' onPress={() => handleFetchReport()} />
      )}
      
      <Spacer space={15} />
      {/* Display the report data in a table */}
      {!isReportFetching && reportData.length > 0 && (
        <>
          <ThemedView style={{ width: '95%', alignSelf: 'center' }}>            
            {/* Get column headers from first row */}
            {(() => {
              // Get all columns and reorder to show first_name and last_name first
              const allColumns = reportData[0] ? Object.keys(reportData[0]) : [];
              const priorityColumns = ['first_name', 'last_name'];
              const otherColumns = allColumns.filter(col => !priorityColumns.includes(col));
              const columns = [
                ...priorityColumns.filter(col => allColumns.includes(col)), // Add priority columns if they exist
                ...otherColumns // Add remaining columns
              ];
              
              return (
                <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, overflow: 'hidden' }}>
                  {/* Horizontal scroll for both header and body */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                      {/* Fixed Table Header */}
                      <View style={{ 
                        flexDirection: 'row', 
                        backgroundColor: colors.primary,
                        borderBottomWidth: 2, 
                        borderBottomColor: colors.border, 
                        paddingVertical: 12
                      }}>
                        {columns.map((key) => (
                          <ThemedText 
                            key={key} 
                            style={{ 
                              width: 120, 
                              fontWeight: 'bold', 
                              paddingHorizontal: 8,
                              fontSize: 13 
                            }}
                          >
                            {key}
                          </ThemedText>
                        ))}
                      </View>
                      
                      {/* Scrollable Table Body */}
                      <ScrollView 
                        style={{ maxHeight: 475 }}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        {reportData.map((row, index) => (
                          <View 
                            key={index} 
                            style={{ 
                              flexDirection: 'row', 
                              borderBottomWidth: 1, 
                              borderBottomColor: colors.border,
                              paddingVertical: 8,
                              backgroundColor: index % 2 === 0 ? colors.background : colors.primary
                            }}
                          >
                            {columns.map((key) => (
                              <ThemedText 
                                key={key} 
                                style={{ 
                                  width: 120, 
                                  paddingHorizontal: 8,
                                  fontSize: 12 
                                }}
                              >
                                {row[key] !== null && row[key] !== undefined && row[key] !== '' ? row[key].toString() : ''}
                              </ThemedText>
                            ))}
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              );
            })()}
          </ThemedView>
          
          <Spacer space={10} />
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
            <ThemedButton title='Export to CSV' onPress={() => handleExport()} icon="MaterialIcons:file-download" />
            <ThemedButton 
              title='Clear' 
              onPress={() => setReportData([])} 
              style={{ backgroundColor: colors.error }}
            />
          </View>
        </>
      )}
      <Spacer space={10} />
    </>
  )
}

