import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../service/service";
import Goback from '../../component/Goback'
import { useNavigation } from '@react-navigation/native';

const RegisterPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      account: "",
      password: "",
      confirmPassword: ""
    },
    validate: (values) => {
      const re = /[^a-zA-Z0-9]/
      const errors = {};
      if (re.test(values.account)) errors.account = '*' + "必須英文或數字";
      if (re.test(values.password)) errors.password = '*' + "必須英文或數字";

      if (!values.account) errors.account = '*' + "帳號必填";
      if (values.account && values.account.length > 18) errors.account = '*' + "帳號字數必須小於18";

      if (!values.password) errors.password = '*' + "密碼必填";
      if (values.password && values.password.length > 18) errors.password = '*' + "密碼字數必須小於18";

      if (values.confirmPassword !== values.password) errors.confirmPassword = '*' + "重複輸入密碼不同";

      return errors;
    },
    onSubmit: async (values) => {
      dispatchfunction(values)
    },
  });

  const dispatchfunction = (values) => {
    register(values)
  }

  const register = async (values) => {
    appCtx.setLoading(true)

    let submitData = {
      "account": values.account,
      "password": values.password,
    }
    const response = await service.postRegister(submitData);
    if (response?.status === 'success') navigation.goBack()
    appCtx.setLoading(false);
  }

  return (
    <UI.View useSafeArea={true} style={styles.container}>
      <RN.KeyboardAvoidingView behavior={RN.Platform.OS === "ios" ? "padding" : "height"}>
        <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>
          <Goback />
          <UI.View style={styles.itemContainer}>
            <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>新增帳號</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'請輸入新增帳號'}
                textAlign='left'
                placeholderTextColor="gray"
                value={formik.values.account}
                onChangeText={formik.handleChange("account")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.account}
                </UI.Text>
              </UI.View>
            </UI.View>
            <UI.View>
              <UI.View style={styles.inputContainer}>
                <UI.View style={styles.inputText}>
                  <UI.Text>密碼</UI.Text>
                </UI.View>
                <RN.TextInput
                  placeholder={'請輸入密碼'}
                  placeholderTextColor="gray"
                  textAlign='left'
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  secureTextEntry={true}
                  style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
                />
                <UI.View style={styles.inputText}>
                  <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                    {formik.errors.password}
                  </UI.Text>
                </UI.View>
              </UI.View>
            </UI.View>
            <UI.View>
              <UI.View style={styles.inputContainer}>
                <UI.View style={styles.inputText}>
                  <UI.Text >重新輸入密碼</UI.Text>
                </UI.View>
                <RN.TextInput
                  placeholder={'請重新輸入密碼'}
                  placeholderTextColor="gray"
                  textAlign='left'
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  secureTextEntry={true}
                  style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
                />
                <UI.View style={styles.inputText}>
                  <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                    {formik.errors.confirmPassword}
                  </UI.Text>
                </UI.View>
              </UI.View>
            </UI.View>
            <UI.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
              <UI.View style={[styles.registerText,{backgroundColor: appCtx.Colors.primary}]}>
                <UI.Text style={[{ color: appCtx.Colors.registerText, textAlign: 'center', }]}>註冊</UI.Text>
              </UI.View>
            </UI.TouchableOpacity>
          </UI.View>
        </RN.TouchableOpacity>
      </RN.KeyboardAvoidingView>
    </UI.View>
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
    borderRadius: 5
  },
  inputText: {
    width: '60%',
    margin: 7
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
    borderRadius: 5
  },

});

export default RegisterPage;
