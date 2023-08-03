import React from 'react';
import * as RN from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useIsFocused} from '@react-navigation/native';

import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback';
import service from '../Service/service';
import {useAppSelector} from '../../redux/store';
import Modal from '../../component/Modal';

const Content = () => {
  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext);
  const [userList, setUserList] = React.useState([]);
  const [userPermission, setUserPermission] = React.useState({});
  const reduxId = useAppSelector(state => state.id);
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = () => {
    patchUploadUserPermission();
    setModalOpen(false);
  };

  const closeModal = () => {
    getFindAllUserBack();
    setModalOpen(false);
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

  const patchUploadUserPermission = async (values, e) => {
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
    getFindAllUserBack();
  }, [isFocused]);

  React.useEffect(() => {
    if (userPermission._id) setModalOpen(true);
  }, [userPermission]);

  return (
    <RN.View
      style={[
        styles.listContainer,
        {borderColor: appCtx.Colors.Platform.borderPrimary},
      ]}>
      {userList.map((item, index) => {
        return (
          <RN.View style={[styles.pickerContainer]} key={index}>
            <RN.Text style={[styles.pickerContainerText]}>
              {`帳號: ${item.account}`}
            </RN.Text>
            <RN.View style={[styles.pickerContent]}>
              <Picker
                selectedValue={item.permission}
                onValueChange={e => handleChange(item, e)}
                style={{
                  fontSize: 17,
                  marginRight: 40,
                  borderBottomWidth: 1,
                  width: '100%',
                  textAlign: 'center',
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
      <Modal
        isOpen={modalOpen}
        confirm={openModal}
        cancel={closeModal}
        content={'是否確認修改'}
      />
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  pickerContainerText: {
    fontSize: 17,
    width: 200,
    textAlign: 'center',
  },
  pickerContent: {
    marginTop: 10,
    width: 200,
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
