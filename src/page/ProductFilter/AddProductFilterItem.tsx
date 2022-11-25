import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../service/service";
import Goback from '../../component/Goback'
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
interface ProductFilterItem {
  // label?: string
  category?: string
  token?: string
}

const AddProductFilterItem = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector(state => state.token)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      // label: "",
      category: "",
    },
    validate: (values) => {
      const reg = /^\d+(\.\d{1,4})?$/
      const errors: ProductFilterItem = {};

      // if (!values.label) errors.label = '*' + "商品分類名稱必填";
      if (!values.category) errors.category = '*' + "商品分類必填";

      return errors;
    },
    onSubmit: async (values) => {
      postCreateProductFilter(values)
    },
  });

  const postCreateProductFilter = async (values: ProductFilterItem) => {
    appCtx.setLoading(true)

    let submitData = {
      // "label": values.label,
      "category": values.category,
      "token": reduxToken,
    }
    const response = await service.postCreateProductFilter(submitData);
    if (response?.status === 'success') navigation.goBack()
    appCtx.setLoading(false);
  }

  return (
    <UI.View useSafeArea={true} style={styles.container}>
      <RN.KeyboardAvoidingView behavior={RN.Platform.OS === "ios" ? "padding" : "height"}>
        <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>
          <Goback />
          <UI.View style={styles.itemContainer}>
            {/* <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>新增商品分類名稱</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'請輸入新增商品分類名稱'}
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
            </UI.View> */}
            <UI.View style={styles.inputContainer}>
              <UI.View style={styles.inputText}>
                <UI.Text>新增商品分類</UI.Text>
              </UI.View>
              <RN.TextInput
                placeholder={'請輸入新增商品分類'}
                placeholderTextColor="gray"
                textAlign='left'
                value={formik.values.category}
                onChangeText={formik.handleChange("category")}
                style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
              />
              <UI.View style={styles.inputText}>
                <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                  {formik.errors.category}
                </UI.Text>
              </UI.View>
            </UI.View>
            <UI.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
              <UI.View style={[styles.registerText,{backgroundColor: appCtx.Colors.primary}]}>
                <UI.Text style={[{ color: appCtx.Colors.registerText, textAlign: 'center',  }]}>新增商品分類資料</UI.Text>
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
    borderRadius:5
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
    borderWidth:1.5,
    borderRadius:5,
  },
});

export default AddProductFilterItem;
