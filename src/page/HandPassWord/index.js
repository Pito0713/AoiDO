import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../Service/Service";
import Goback from '../../component/Goback'
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';

const HandPassWord = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector(state => state.token)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      oldPassWord: "",
      newPassWord: "",
      newPassWordAgain: "",
    },
    validate: (values) => {
      const errors = {};
      return errors;
    },
    onSubmit: async (values) => {
      postHandPassWord(values)
    },
  });

  const postHandPassWord = async (values) => {
    appCtx.setLoading(true)

    let submitData = {
      "oldPassWord": values.oldPassWord,
      "newPassWord": values.newPassWord,
      "newPassWordAgain": values.newPassWordAgain,
      "token": reduxToken,
    }
    const response = await service.postHandPassWord(submitData);
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
                <UI.Text>舊密碼</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'舊密碼'}
                textAlign='left'
                placeholderTextColor="gray"
                value={formik.values.oldPassWord}
                onChangeText={formik.handleChange("oldPassWord")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.oldPassWord}
                </UI.Text>
              </UI.View>
            </UI.View>
            <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>新的密碼</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'新的密碼'}
                placeholderTextColor="gray"
                textAlign='left'
                value={formik.values.newPassWord}
                onChangeText={formik.handleChange("newPassWord")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.newPassWord}
                </UI.Text>
              </UI.View>
            </UI.View>
            <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>重新確認新的密碼</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'重新確認新的密碼'}
                placeholderTextColor="gray"
                textAlign='left'
                value={formik.values.newPassWordAgain}
                onChangeText={formik.handleChange("newPassWordAgain")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.newPassWordAgain}
                </UI.Text>
              </UI.View>
            </UI.View>

            <UI.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
              <UI.View style={[styles.registerText,{backgroundColor: appCtx.Colors.primary}]}>
                <UI.Text style={[{ color: appCtx.Colors.registerText, textAlign: 'center', }]}>修改資料</UI.Text>
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
    height: 45,
    paddingLeft: 15,
    borderWidth: 1.5,
    borderRadius:5
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
    borderRadius:5
  },
});

export default HandPassWord;
