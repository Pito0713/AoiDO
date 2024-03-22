import React from "react";
import * as RN from 'react-native';
import { useFormik } from "formik";
import { useNavigation } from '@react-navigation/native';

import service from "../Service/service";
import Goback from '../../component/Goback'
// import { useAppSelector } from '../../redux/store';
import { AppContext } from '../../redux/AppContent';

const windowHeight = RN.Dimensions.get('window').height;
interface PlatformItem {
  label?: string
  rate?: string
  token?: string
}
const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  // const reduxToken = useAppSelector((state: { token: any; }) => state.token)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      label: "",
      rate: "",
    },
    validate: (values: { label: any; rate: string; }) => {
      const reg = /^\d+(\.\d{1,4})?$/
      const errors: PlatformItem = {};

      if (!values.label) errors.label = '*' + "名稱必填";
      if (!values.rate) errors.rate = '*' + "平台費用匯率必填";
      if (!reg.test(values.rate)) errors.rate = '*' + "必須數字且最多小數點後第4位";

      return errors;
    },

    onSubmit: async (values: PlatformItem) => {
      postCreateModifyRate(values)
    },
  });

  const postCreateModifyRate = async (values: PlatformItem) => {
    let submitData = {
      "label": values.label,
      "rate": values.rate,
      // "token": reduxToken,
      "isActive": false,
    }
    await appCtx.setLoading(true)
    const response = await service.postCreateModifyRate(submitData);
    // 成功後返回
    if (response?.status === 'success') navigation.goBack()
    await appCtx.setLoading(false);
  }


  return (
    <RN.View style={styles.itemContainer}>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>{'新增名稱'}</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'請輸入新增名稱'}
          textAlign='left'
          placeholderTextColor="gray"
          value={formik.values.label}
          onChangeText={formik.handleChange("label")}
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[, { color: appCtx.Colors.errorText }]}>
            {formik.errors.label}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.View style={styles.inputText}>
          <RN.Text>{'新增費用匯率'}</RN.Text>
        </RN.View>
        <RN.TextInput
          placeholder={'請輸入新增費用匯率'}
          placeholderTextColor="gray"
          textAlign='left'
          value={formik.values.rate}
          onChangeText={formik.handleChange("rate")}
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
        />
        <RN.View style={styles.inputText}>
          <RN.Text style={[, { color: appCtx.Colors.errorText }]}>
            {formik.errors.rate}
          </RN.Text>
        </RN.View>
      </RN.View>

      <RN.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
        <RN.View style={[styles.registerText, { backgroundColor: appCtx.Colors.primary }]}>
          <RN.Text style={[{ textAlign: 'center', }]}>{'新增資料'}</RN.Text>
        </RN.View>
      </RN.TouchableOpacity>

    </RN.View>
  );
};

const AddPlatformItem = () => {
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
    marginBottom: 20,
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
