import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import {useIsFocused} from '@react-navigation/native';

import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback';
import ScrollViewComponent from '../../component/ScrollViewComponent';
import service from '../Service/service';
import {useAppSelector} from '../../redux/store';
import ArrowDrop from '../../assets/ArrowDrop';

const Content = () => {
  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext);
  const [userList, setUserList] = React.useState([]);
  const [userPermission, setUserPermission] = React.useState({});
  const reduxId = useAppSelector(state => state.id);

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
    values.permission = e.value;
    setUserPermission(values);
  };

  const patchUploadUserPermission = async (values, e) => {
    let submitData = {
      id: userPermission.id,
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
  const uploadPermissionItem = () => {
    RN.Alert.alert(
      '是否確認修改',
      '',
      [
        {
          text: '取消',
          onPress: () => getFindAllUserBack(),
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => patchUploadUserPermission(),
          style: 'OK',
        },
      ],
      {},
    );
  };

  React.useEffect(() => {
    getFindAllUserBack();
  }, [isFocused]);

  React.useEffect(() => {
    if (userPermission.id) uploadPermissionItem();
  }, [userPermission]);

  return (
    <RN.View
      style={[
        styles.listContainer,
        {borderColor: appCtx.Colors.Platform.borderPrimary},
      ]}>
      {userList.map(item => {
        return (
          <RN.View style={[styles.pickerContainer]}>
            <RN.Text style={[styles.pickerContainerText]}>
              {`帳號: ${item.account}`}
            </RN.Text>
            <RN.View style={[styles.pickerContent]}>
              <UI.Picker
                placeholder="選擇權限"
                value={item.permission}
                onChange={e => handleChange(item, e)}
                enableModalBlur={false}
                topBarProps={{title: '權限選項'}}
                migrateTextField
                style={{
                  fontSize: 17,
                  marginRight: 40,
                  borderBottomWidth: 1,
                  width: '100%',
                  textAlign: 'center',
                }}
                trailingAccessory={<ArrowDrop />}>
                {permissionList.map((item, index) => (
                  <UI.Picker.Item
                    key={index}
                    value={item?.value}
                    label={item?.label}
                  />
                ))}
              </UI.Picker>
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
      <ScrollViewComponent item={() => Content()}></ScrollViewComponent>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainerText: {
    fontSize: 17,
    width: '60%',
    textAlign: 'center',
  },
  pickerContent: {
    marginTop: 10,
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
