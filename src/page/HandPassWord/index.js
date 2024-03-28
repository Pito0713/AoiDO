import React from 'react';
import * as RN from 'react-native';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';

import { AppContext } from '../../redux/AppContent';
import service from '../Service/service';
import Goback from '../../component/Goback';
import { APP_SECRCT_KEY } from '../../env/config';
import {
  // registerActions,
  useAppSelector,
  useAppDispatch,
} from '../../redux/store';

const windowHeight = RN.Dimensions.get('window').height;

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const reduxToken = useAppSelector(state => state.token);
  const reduxPassword = useAppSelector(state => state.password);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      oldPassWord: '',
      newPassWord: '',
      newPassWordAgain: '',
    },
    validate: values => {
      const errors = {};
      // 解密
      let decryptValue = CryptoJS.AES.decrypt(reduxPassword, APP_SECRCT_KEY);
      let originalValue = decryptValue.toString(CryptoJS.enc.Utf8);

      if (!values.oldPassWord) errors.oldPassWord = '*' + '舊密碼必填';
      if (values.oldPassWord && originalValue !== values.oldPassWord) {
        errors.oldPassWord = '*' + '舊密碼不相同';
      }
      if (!values.newPassWord) errors.newPassWord = '*' + '新密碼必填';
      if (values.newPassWord && originalValue === values.newPassWord) {
        errors.newPassWord = '*' + '不可與舊密碼相同';
      }
      if (
        values.newPassWordAgain !== values.newPassWord ||
        !values.newPassWordAgain
      ) {
        errors.newPassWordAgain = '*' + '與新密碼必須相同';
      }

      return errors;
    },
    onSubmit: async values => {
      postHandPassWord(values);
    },
  });

  const postHandPassWord = async values => {
    appCtx.setLoading(true);

    let submitData = {
      oldPassWord: values.oldPassWord,
      newPassWord: values.newPassWord,
      newPassWordAgain: values.newPassWordAgain,
      token: reduxToken,
    };

    const response = await service.postHandPassWord(submitData);
    if (response?.status === 'success') {
      // 加密
      // let encryptValue = CryptoJS.AES.encrypt(
      //   values.newPassWord,
      //   APP_SECRCT_KEY,
      // ).toString();
      // dispatch(registerActions.SET_PASSWORD(encryptValue));

      navigation.goBack();
    }
    appCtx.setLoading(false);
  };

  return (
    <RN.View style={styles.itemContainer}>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>{'舊密碼'}</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'舊密碼'}
          textAlign="left"
          placeholderTextColor="gray"
          value={formik.values.oldPassWord}
          onChangeText={formik.handleChange('oldPassWord')}
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[, { color: appCtx.Colors.errorText }]}>
            {formik.errors.oldPassWord}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>{'新的密碼'}</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'新的密碼'}
          placeholderTextColor="gray"
          textAlign="left"
          value={formik.values.newPassWord}
          onChangeText={formik.handleChange('newPassWord')}
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.newPassWord}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>{'重新確認新的密碼'}</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'重新確認新的密碼'}
          placeholderTextColor="gray"
          textAlign="left"
          value={formik.values.newPassWordAgain}
          onChangeText={formik.handleChange('newPassWordAgain')}
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.newPassWordAgain}
          </RN.Text>
        </RN.View>
      </RN.View>

      <RN.TouchableOpacity
        style={styles.registerContainer}
        onPress={() => formik.submitForm()}>
        <RN.View
          style={[
            styles.registerText,
            { backgroundColor: appCtx.Colors.primary },
          ]}>
          <RN.Text
            style={[{ color: appCtx.Colors.registerText, textAlign: 'center' }]}>
            {"修改資料"}
          </RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const HandPassWordPage = () => {
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
    justifyContent: 'center',
    marginTop: windowHeight / 10,
    marginBottom: 30,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '60%',
    height: 45,
    paddingLeft: 15,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  inputText: {
    width: '60%',
    margin: 7,
  },
  registerContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  registerText: {
    width: '40%',
    padding: 15,
    borderWidth: 1.5,
    borderRadius: 5,
  },
});

export default HandPassWordPage;
