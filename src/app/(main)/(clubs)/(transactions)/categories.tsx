import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import InputText from '@/src/components/InputText';
import ThemedButton from '@/src/components/ThemedButton';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Spacer from '@/src/components/Spacer';
import { useTheme } from '@/src/hooks/use-theme';
import { ClubContext } from '@/src/context/ClubContext';
import { UserContext } from '@/src/context/UserContext';
import { useGetTransactionCategoriesQuery, useAddTransactionCategoryMutation, useUpdateTransactionCategoryMutation, useDeleteTransactionCategoryMutation } from '@/src/services/feeApi';
import Modal from 'react-native-modal';
import RoundedContainer from '@/src/components/RoundedContainer';
import TouchableCard from '@/src/components/TouchableCard';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import Alert, { AlertProps } from '@/src/components/Alert';
import { appStyles } from '@/src/utils/styles';

const CategoriesManager = () => {
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();

  const { data: categories = [], isLoading } = useGetTransactionCategoriesQuery({ clubId: clubInfo.clubId });
  const [addCategory] = useAddTransactionCategoryMutation();
  const [updateCategory] = useUpdateTransactionCategoryMutation();
  const [deleteCategory] = useDeleteTransactionCategoryMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [alertConfig, setAlertConfig] = useState<AlertProps>();

  const showAddModal = () => {
    setIsEdit(false);
    setCategoryId(null);
    setCategoryName('');
    setIsModalVisible(true);
  };

  const showEditModal = (item: any) => {
    setIsEdit(true);
    setCategoryId(item.categoryId);
    setCategoryName(item.categoryName);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const name = categoryName?.trim();
    if (!name || name.length < 2) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Enter at least 2 characters for category name.',
        buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }],
      });
      return;
    }
    setIsSaving(true);
    setIsModalVisible(false);
    try {
      if (isEdit && categoryId != null) {
        await updateCategory({ clubId: clubInfo.clubId, categoryId, categoryName: name, email: userInfo.email }).unwrap();
      } else {
        await addCategory({ clubId: clubInfo.clubId, categoryName: name, email: userInfo.email }).unwrap();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (categoryId == null) return;
    setAlertConfig({
      visible: true,
      title: 'Are you sure!',
      message: 'This will delete the category. This cannot be recovered.',
      buttons: [
        { text: 'OK', onPress: async () => { setAlertConfig({ visible: false }); setIsSaving(true); setIsModalVisible(false); try { await deleteCategory({ clubId: clubInfo.clubId, categoryId }).unwrap(); } finally { setIsSaving(false); } } },
        { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={10} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && categories?.length === 0 && (
        <ThemedText style={{ width: '80%', alignSelf: 'center' }}>
          Define transaction categories to organize your club transactions. Eg. Equipment, Ground Fee, Travel, etc.
        </ThemedText>
      )}
      {!isLoading && categories?.map((item: any) => (
        <View key={item.categoryId}>
          <RoundedContainer>
            <TouchableCard
              style={{ justifyContent: 'space-between' }}
              onPress={() => showEditModal(item)}
              icon={<ThemedIcon name={'MaterialCommunityIcons:square-edit-outline'} />}
            >
              <ThemedText>{item.categoryName}</ThemedText>
            </TouchableCard>
          </RoundedContainer>
          <Spacer space={4} />
        </View>
      ))}
      <Spacer space={10} />
      {isSaving && <LoadingSpinner />}
      {!isSaving && (
        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={showAddModal}>
          <ThemedIcon name={'MaterialIcons:add-circle'} size={50} />
        </TouchableOpacity>
      )}
      <View style={{ marginBottom: 30 }} />
      <Modal isVisible={isModalVisible}>
        <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
          <Spacer space={5} />
          <ThemedText style={appStyles.heading}>{isEdit ? 'Edit' : 'Add'} Category</ThemedText>
          <Spacer space={5} />
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', width: '80%' }}>
            <InputText label='Category Name' defaultValue={categoryName} onChangeText={(value: string) => setCategoryName(value)} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, alignItems: 'center' }}>
            <ThemedButton title={'   Save   '} onPress={() => handleSave()} />
            <ThemedButton title='Cancel' onPress={() => setIsModalVisible(false)} />
            {isEdit && (
              <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => handleDelete()} color={colors.error} />
            )}
          </View>
        </ThemedView>
      </Modal>
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
};

export default CategoriesManager;
