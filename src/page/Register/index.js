import React from 'react';
import * as RN from 'react-native';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {AppContext} from '../../redux/AppContent';
import service from '../Service/service';
import Goback from '../../component/Goback';
import ScrollViewComponent from '../../component/ScrollViewComponent';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      account: '',
      password: '',
      confirmPassword: '',
    },
    validate: values => {
      const re = /[^a-zA-Z0-9]/;
      const errors = {};
      if (re.test(values.account)) errors.account = '*' + '必須英文或數字';
      if (re.test(values.password)) errors.password = '*' + '必須英文或數字';

      if (!values.account) errors.account = '*' + '帳號必填';
      if (values.account && values.account.length > 18)
        errors.account = '*' + '帳號字數必須小於18';

      if (!values.password) errors.password = '*' + '密碼必填';
      if (values.password && values.password.length > 18)
        errors.password = '*' + '密碼字數必須小於18';

      if (values.confirmPassword !== values.password)
        errors.confirmPassword = '*' + '重複輸入密碼不同';

      return errors;
    },
    onSubmit: async values => {
      dispatchfunction(values);
    },
  });

  const dispatchfunction = values => {
    register(values);
  };

  const register = async values => {
    appCtx.setLoading(true);

    let submitData = {
      account: values.account,
      password: values.password,
    };
    const response = await service.posUserBackRegister(submitData);
    if (response?.status === 'success') navigation.goBack();
    appCtx.setLoading(false);
  };

  return (
    <RN.View style={styles.itemContainer}>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>新增帳號</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'請輸入新增帳號'}
          textAlign="left"
          placeholderTextColor="gray"
          value={formik.values.account}
          onChangeText={formik.handleChange('account')}
          style={[
            styles.input,
            {backgroundColor: appCtx.Colors.inputContainer},
          ]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[{color: appCtx.Colors.errorText}]}>
            {formik.errors.account}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.View style={styles.inputContainer}>
          <RN.View style={styles.inputText}>
            <RN.Text>密碼</RN.Text>
          </RN.View>
          <RN.TextInput
            placeholder={'請輸入密碼'}
            placeholderTextColor="gray"
            textAlign="left"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            secureTextEntry={true}
            style={[
              styles.input,
              {backgroundColor: appCtx.Colors.inputContainer},
            ]}
          />
          <RN.View style={styles.inputText}>
            <RN.Text style={[, {color: appCtx.Colors.errorText}]}>
              {formik.errors.password}
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.View style={styles.inputContainer}>
          <RN.View style={styles.inputText}>
            <RN.Text>重新輸入密碼</RN.Text>
          </RN.View>
          <RN.TextInput
            placeholder={'請重新輸入密碼'}
            placeholderTextColor="gray"
            textAlign="left"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            secureTextEntry={true}
            style={[
              styles.input,
              {backgroundColor: appCtx.Colors.inputContainer},
            ]}
          />
          <RN.View style={styles.inputText}>
            <RN.Text style={[, {color: appCtx.Colors.errorText}]}>
              {formik.errors.confirmPassword}
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.TouchableOpacity
        style={styles.registerContainer}
        onPress={() => formik.submitForm()}>
        <RN.View
          style={[
            styles.registerText,
            {backgroundColor: appCtx.Colors.primary},
          ]}>
          <RN.Text
            style={[{color: appCtx.Colors.registerText, textAlign: 'center'}]}>
            註冊
          </RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const RegisterPage = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={Content} />
    </RN.SafeAreaView>
  );
};
const windowHeight = RN.Dimensions.get('window').height;
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    marginTop: windowHeight / 10,
    marginBottom: 20,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '60%',
    paddingLeft: 15,
    height: 45,
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

export default RegisterPage;
