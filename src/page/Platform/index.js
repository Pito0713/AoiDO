import React from 'react';
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import service from '../Service/service';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback';
import ReminderText from '../../component/ReminderText';
import { Plus, Cancel } from '../../assets';
import Modal from '../../component/Modal';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  // 初始化
  const [init, setInit] = React.useState(false);

  const [platform, setPlatform] = React.useState([]);
  // Modal
  const openModal = (_id) => {
    appCtx.setModalOpen(true);
    appCtx.setModal({
      onConfirm: () => { deleteModifyRate(_id), appCtx.setModalOpen(false); },
      content: '是否刪除'
    });
  };


  // 取得平台匯率
  const postPlatformRate = async () => {
    await appCtx.setLoading(true);
    const response = await service.postPlatformRate();
    if (response?.status === 'success') {
      setPlatform(response.data);
    }
    await appCtx.setLoading(false);
  };

  // 更新平台匯率
  const postUpdateModifyRate = async item => {
    let submitData = {
      id: item,
    };
    await appCtx.setLoading(true);
    const response = await service.postUpdateModifyRate(submitData);

    // 成功後重整
    if (response?.status === 'success') postPlatformRate();
    await appCtx.setLoading(false);
  };

  const deleteModifyRate = async (_id) => {
    let submitData = {
      id: _id,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteModifyRate(submitData);

    // 成功後重整
    if (response?.status === 'success') postPlatformRate();
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    if (init) {
      postPlatformRate()
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setPlatform([]);
      }
    }, [])
  );
  return (
    <RN.View>
      <RN.View
        style={[
          styles.listContainer,
          { borderColor: appCtx.Colors.Platform.borderPrimary },
        ]}>
        <ReminderText text={'* 預設費用無法刪除'} />
        <ReminderText text={'* 點擊X 可刪除圖片'} />
        <ReminderText text={'* 點擊項目, 可啟用平台匯率'} />
        <ReminderText text={'* 點擊+ 可新增匯率項目'} />
      </RN.View>
      <RN.View>
        {(platform?.length > 0 && Array.isArray(platform)) ? (
          platform.map((item, index) => {
            return (
              <RN.View key={index}>
                {item.token !== '1' && <RN.TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={() => openModal(item._id)}>
                  <Cancel />
                </RN.TouchableOpacity>}
                <RN.TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => postUpdateModifyRate(item._id)}
                // // onLongPress={() => deleteItem(item._id)}
                >
                  <RN.View style={[
                    styles.itemContent,
                    {
                      flex: 2,
                      backgroundColor: appCtx.Colors.Platform.cardTitle,
                    },
                  ]}>
                    <RN.Text style={[styles.itemContentText, {
                      color: appCtx.Colors.Platform.textPrimary
                    }]}>
                      {item.label}
                    </RN.Text>
                  </RN.View>
                  <RN.View style={[
                    styles.itemContent,
                    {
                      flex: 6.5,
                    },
                  ]}>
                    <RN.Text style={styles.itemContentText}>
                      {item.rate} %
                    </RN.Text>
                  </RN.View>
                  <RN.View
                    style={[
                      styles.itemContent,
                      {
                        flex: 1.5,
                        backgroundColor: item.isActive ? appCtx.Colors.Platform.activeItem : appCtx.Colors.Platform.cardContainer,
                      }
                    ]}>
                    {item.isActive ? (
                      <RN.Text style={styles.itemContentText}>進行中</RN.Text>
                    ) : (
                      <RN.Text style={styles.itemContentText}>未啟用</RN.Text>
                    )}
                  </RN.View>
                </RN.TouchableOpacity>
              </RN.View>
            )
          })
        ) : (
          <RN.View style={styles.itemContainer}>
            <RN.View style={styles.itemContent}>
              <RN.Text style={{ fontSize: 20 }}>{'尚無資料'}</RN.Text>
            </RN.View>
          </RN.View>
        )}
        <RN.TouchableOpacity
          style={[styles.itemContainer, { marginTop: 40 }]}
          onPress={() => navigation.navigate('AddPlatformItem')}>
          <RN.View style={[styles.itemContent, { flex: 1 }]}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
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
    marginHorizontal: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  itemContentText: {
    fontSize: 20,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  listText: {
    textAlign: 'center',
    fontSize: 12.5,
  },
});

export default PlatformPage;
