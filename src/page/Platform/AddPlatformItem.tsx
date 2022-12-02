import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../Service/Service";
import Goback from '../../component/Goback'
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
import { Hint } from "react-native-ui-lib";
interface PlatformItem {
  label?: string
  rate?: string
  token?: string
}

const AddPlatformItem = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector(state => state.token)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      label: "",
      rate: "",
    },
    validate: (values) => {
      const reg = /^\d+(\.\d{1,4})?$/
      const errors: PlatformItem = {};

      if (!values.label) errors.label = '*' + "平台名稱必填";
      if (!values.rate) errors.rate = '*' + "平台費用匯率必填";
      if (!reg.test(values.rate)) errors.rate = '*' + "必須數字且最多小數點後第4位";

      return errors;
    },
    onSubmit: async (values) => {
      postCreateModifyRate(values)
    },
  });

  const postCreateModifyRate = async (values: PlatformItem) => {
    appCtx.setLoading(true)

    let submitData = {
      "label": values.label,
      "rate": values.rate,
      "token": reduxToken,
    }
    const response = await service.postCreateModifyRate(submitData);
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
                <UI.Text>新增平台名稱</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'請輸入新增平台名稱'}
                textAlign='left'
                placeholderTextColor="gray"
                value={formik.values.label}
                onChangeText={formik.handleChange("label")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.label}
                </UI.Text>
              </UI.View>
            </UI.View>
            <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>新增平台費用匯率</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'請輸入新增平台費用匯率'}
                placeholderTextColor="gray"
                textAlign='left'
                value={formik.values.rate}
                onChangeText={formik.handleChange("rate")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.rate}
                </UI.Text>
              </UI.View>
            </UI.View>

            <UI.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
              <UI.View style={[styles.registerText,{backgroundColor:appCtx.Colors.primary}]}>
                <UI.Text style={[{textAlign: 'center', }]}>新增平台資料</UI.Text>
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

export default AddPlatformItem;
