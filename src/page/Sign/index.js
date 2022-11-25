import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../service/service";
import { useNavigation } from '@react-navigation/native';
import { registerActions, useAppSelector, useAppDispatch } from '../../redux/store';
const windowHeight = RN.Dimensions.get('window').height;

const SignInPage = () => {
  const navigation = useNavigation();
  const appCtx = React.useContext(AppContext);
  const dispatch = useAppDispatch();



  // redux
  const reduxAccount = useAppSelector(state => state.account)
  const reduxRememberInfo = useAppSelector(state => state.rememberInfo)

  // data
  const [rememberInfo, setRememberInfo] = React.useState(reduxRememberInfo)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      account: reduxRememberInfo ? reduxAccount : "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.account) {
        errors.account = '*' + "帳號必填";
      }
      if (!values.password) {
        errors.password = '*' + "密碼必填";
      }
      return errors;
    },
    onSubmit: async (values) => {
      logIn(values)
    },
  });

  const logIn = async (values) => {
    appCtx.setLoading(true);
    let submitData = {
      "account": formik.values.account,
      "password": formik.values.password,
    }
    const response = await service.postLogin(submitData);
    if (!['', null, undefined].includes(response?.data)) dispatchHandler(response.data)
    appCtx.setLoading(false);
  }

  const dispatchHandler = (values) => {
    if (!['', null, undefined].includes(values?.user?.account)) dispatch(registerActions.SET_ACCOUNT(values.user.account));
    if (!['', null, undefined].includes(values?.user?.token)) dispatch(registerActions.SET_TOKEN(values.user.token));
    dispatch(registerActions.SET_REMEMBERINFO(rememberInfo))
  };



  return (
    <RN.SafeAreaView style={styles.container}>
      <RN.KeyboardAvoidingView keyboardVerticalOffset={windowHeight}>
        <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>
          <UI.View style={styles.logInContainer}>
            <UI.View style={styles.border}>
              <UI.View
                style={[
                  styles.InputContainer,
                  { backgroundColor: appCtx.Colors.inputContainer }
                ]}
              >
                <RN.TextInput
                  placeholder={'請輸入帳號'}
                  textAlign='left'
                  placeholderTextColor="gray"
                  value={formik.values.account}
                  onChangeText={formik.handleChange("account")}
                  style={styles.input}
                />
              </UI.View>
            </UI.View>
            <UI.View style={styles.border}>
              <UI.View
                style={[
                  styles.InputContainer,
                  { backgroundColor: appCtx.Colors.inputContainer }
                ]}
              >
                <RN.TextInput
                  placeholder={'請輸入密碼'}
                  placeholderTextColor="gray"
                  textAlign='left'
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  secureTextEntry={true}
                  style={styles.input}
                />
              </UI.View>
            </UI.View>
          </UI.View>
          <UI.View style={[styles.errorText]}>
            {['', null, undefined].includes(formik.values.account) && <UI.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12, }]}> {formik.errors.account}</UI.Text>}
            {['', null, undefined].includes(formik.values.password) && <UI.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12, }]}> {formik.errors.password}</UI.Text>}
          </UI.View>
          <UI.View style={styles.buttomGround}>
            <UI.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
              <UI.Text style={[styles.registerText, { textAlign: 'center' ,backgroundColor: appCtx.Colors.primary}]}>{'登入'}</UI.Text>
            </UI.TouchableOpacity>
          </UI.View>
          <UI.View style={styles.rememberInfoContainer}>
            <UI.TouchableOpacity onPress={() => setRememberInfo(!rememberInfo)} style={{ flexDirection: 'row' }} >
              <UI.Checkbox value={rememberInfo} size={15} onValueChange={() => setRememberInfo(!rememberInfo)} />
              <UI.Text style={{ marginLeft: 8 }}>{'記住帳號'}</UI.Text>
            </UI.TouchableOpacity>
            <UI.TouchableOpacity>
              <UI.Text style={{ marginLeft: 20 }} onPress={() => navigation.navigate('register')} >{'創立帳號'}</UI.Text>
            </UI.TouchableOpacity>
          </UI.View>
        </RN.TouchableOpacity>
      </RN.KeyboardAvoidingView>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  logInContainer: {
    marginTop: windowHeight / 4,
    width: '100%',
    alignItems: 'center',
  },
  border: {
    width: '80%',
    justifyContent: 'center',
  },
  InputContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  input: {
    width: '100%',
    paddingLeft: 15,
    height: 45,
    margin: 5
  },
  rememberInfoContainer: {
    paddingTop: 30,
    width: '90%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  buttomGround: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInText: {
    borderWidth: 1.5,
  },
  errorText: {
    padding: 10,
    justifyContent: 'flex-end',
    marginLeft: '10%',
  },
  registerContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  registerText: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 5
  },
});

export default SignInPage;
