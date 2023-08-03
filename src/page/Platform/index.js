import React from 'react';
import * as RN from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';

import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback';
import ReminderText from '../../component/ReminderText';
import Plus from '../../assets/Plus';
import Cancel from '../../assets/Cancel';
import Modal from '../../component/Modal';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [platform, setPlatform] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('');
  const openModal = item => {
    setModalOpen(true);
    setDeleteId(item);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteId('');
  };

  const postPlatformRate = async () => {
    await appCtx.setLoading(true);
    const response = await service.postPlatformRate();
    if (!['', null, undefined].includes(response?.data)) {
      setPlatform(response.data);
    }
    await appCtx.setLoading(false);
  };

  const updateModifyRate = async item => {
    let submitData = {
      id: item,
    };
    await appCtx.setLoading(true);
    const response = await service.updateModifyRate(submitData);
    await appCtx.setLoading(false);
    if (response?.status === 'success') postPlatformRate();
  };

  const deleteModifyRate = async () => {
    let submitData = {
      id: deleteId,
    };

    await appCtx.setLoading(true);
    const response = await service.deleteModifyRate(submitData);
    await appCtx.setLoading(false);
    closeModal();
    if (response?.status === 'success') postPlatformRate();
  };

  React.useEffect(() => {
    postPlatformRate();
  }, [isFocused]);

  return (
    <RN.View>
      <RN.View
        style={[
          styles.listContainer,
          {borderColor: appCtx.Colors.Platform.borderPrimary},
        ]}>
        <ReminderText text={'* 預設費用無法刪除'} />
        <ReminderText text={'* 長按可刪除分類別'} />
      </RN.View>
      <RN.View>
        {platform.length > 0 ? (
          platform.map((item, index) => {
            return item.token !== '1' ? (
              <RN.View>
                <RN.TouchableOpacity
                  style={{margin: 10}}
                  onPress={() => openModal(item._id)}>
                  <Cancel />
                </RN.TouchableOpacity>
                <RN.TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => updateModifyRate(item._id)}
                  // // onLongPress={() => deleteItem(item._id)}
                  key={index}>
                  <RN.View style={styles.itemContent}>
                    <RN.Text style={styles.itemContentText}>
                      {item.label}
                    </RN.Text>
                    <RN.Text style={styles.itemContentText}>
                      {item.rate} %
                    </RN.Text>
                  </RN.View>
                  <RN.View style={styles.itemContent}>
                    {item.isActive ? (
                      <RN.Text style={styles.itemContentText}>進行中</RN.Text>
                    ) : (
                      <RN.Text style={styles.itemContentText}>啟用</RN.Text>
                    )}
                  </RN.View>
                </RN.TouchableOpacity>
              </RN.View>
            ) : (
              <RN.View
                style={styles.itemContainer}
                key={index}
                onPress={() => updateModifyRate(item.token)}>
                <RN.View style={styles.itemContent}>
                  <RN.Text
                    style={[
                      styles.itemContentText,
                      {color: appCtx.Colors.platformDefault},
                    ]}>
                    {item.label}
                  </RN.Text>
                  <RN.Text
                    style={[
                      styles.itemContentText,
                      {color: appCtx.Colors.platformDefault},
                    ]}>
                    {item.rate} %
                  </RN.Text>
                </RN.View>
                <RN.View style={styles.itemContent}>
                  {item.isActive ? (
                    <RN.Text style={styles.itemContentText}>進行中</RN.Text>
                  ) : (
                    <RN.Text style={styles.itemContentText}>啟用</RN.Text>
                  )}
                </RN.View>
              </RN.View>
            );
          })
        ) : (
          <RN.View style={styles.itemContainer}>
            <RN.View style={styles.itemContent}>
              <RN.Text style={{fontSize: 20}}>尚無資料</RN.Text>
            </RN.View>
          </RN.View>
        )}
        <RN.TouchableOpacity
          style={[styles.itemContainer, {marginTop: 40}]}
          onPress={() => navigation.navigate('AddPlatformItem')}>
          <RN.View style={styles.itemContent}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <Modal
        isOpen={modalOpen}
        confirm={() => deleteModifyRate()}
        cancel={closeModal}
        content={'是否刪除'}
      />
    </RN.View>
  );
};

const PlatformPage = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <Content />
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: 70,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    paddingLeft: 20,
    fontSize: 20,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  listText: {
    textAlign: 'center',
    margin: 2,
    fontSize: 12.5,
  },
});

export default PlatformPage;
