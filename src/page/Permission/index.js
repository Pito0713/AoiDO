import React from 'react';
import * as RN from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback';
import service from '../Service/service';
import { useAppSelector } from '../../redux/store';
import ReminderText from '../../component/ReminderText';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  // 初始化
  const [init, setInit] = React.useState(false);
  const [userList, setUserList] = React.useState([]);
  const [userPermission, setUserPermission] = React.useState({});
  const reduxId = useAppSelector(state => state.id);

  // Modal
  const openModal = (_id) => {
    appCtx.setModalOpen(true);
    appCtx.setModal({
      onConfirm: () => { patchUploadUserPermission(), appCtx.setModalOpen(false); },
      onCancel: () => { getFindAllUserBack(), appCtx.setModalOpen(false); },
      content: '是否確認修改'
    });
  };

  const permissionList = [
    {
      label: '管理員',
      value: 'admin',
    },
    {
      label: '訪客',
      value: 'guest',
    },
  ];

  const getFindAllUserBack = async () => {
    let submitData = {
      id: reduxId,
    };

    appCtx.setLoading(true);
    const response = await service.getFindAllUserBack(submitData);
    if (!['', null, undefined].includes(response?.data)) {
      setUserList(response?.data);
    }
    appCtx.setLoading(false);
  };

  const handleChange = async (values, e) => {
    values.permission = e;
    setUserPermission(values);
  };

  const patchUploadUserPermission = async () => {
    let submitData = {
      id: userPermission._id,
      permission: userPermission.permission,
    };

    appCtx.setLoading(true);
    const response = await service.patchUploadUserPermission(submitData);
    if (response?.status === 'success') {
      getFindAllUserBack();
      setUserPermission({});
    }
    appCtx.setLoading(false);
  };

  React.useEffect(() => {
    if (init) {
      getFindAllUserBack()
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setUserPermission({});
      }
    }, [])
  );

  React.useEffect(() => {
    if (userPermission._id) openModal();
  }, [userPermission]);

  return (
    <RN.View style={{ width: '50%' }}>
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
      {userList.map((item, index) => {
        return (
          <RN.View style={[styles.pickerContainer]} key={index}>
            <RN.View style={[styles.pickerContent, {
              flex: 5,
              backgroundColor: appCtx.Colors.Platform.cardTitle,
            },]}>
              <RN.Text style={[styles.pickerContainerText]}>
                {`帳號: ${item.account}`}
              </RN.Text>
            </RN.View>
            <RN.View style={[styles.pickerContent, {
              flex: 5,

            },]}>
              <Picker
                selectedValue={item.permission}
                onValueChange={e => handleChange(item, e)}
                style={{
                  fontSize: 17,
                  borderWidth: 0,
                  textAlign: 'center',
                  width: '80%',
                  height: '100%',
                }}>
                {permissionList.map((item, index) => (
                  <Picker.Item
                    key={index}
                    value={item?.value}
                    label={item?.label}
                  />
                ))}
              </Picker>
            </RN.View>
          </RN.View>
        );
      })}
    </RN.View>
  );
};

const PermissionPage = () => {
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
  pickerContainer: {
    flex: 1,
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
  pickerContainerText: {
    fontSize: 17,
    textAlign: 'center',
  },
  pickerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
});
export default PermissionPage;
