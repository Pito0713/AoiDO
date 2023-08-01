import React from "react";
import { useFormik } from "formik";
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '../../redux/AppContent';
import service from "../Service/service";
import Goback from '../../component/Goback'
import { useAppSelector } from '../../redux/store';
interface ProductFilterItem {
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
      category: "",
    },
    validate: (values) => {
      const errors: ProductFilterItem = {};

      if (!values.category) errors.category = '*' + "商品分類必填";

      return errors;
    },
    onSubmit: async (values) => {
      postCreateProductFilter(values)
    },
  });

  const postCreateProductFilter = async (values: ProductFilterItem) => {
    let submitData = {
      "category": values.category,
      "token": reduxToken,
    }
    appCtx.setLoading(true)
    const response = await service.postCreateProductFilter(submitData);
    if (response?.status === 'success') navigation.goBack()
    appCtx.setLoading(false);
  }

  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <RN.View style={styles.itemContainer}>
        <RN.View style={styles.inputContainer}>
          <RN.View style={styles.inputText}>
            <RN.Text>新增商品分類</RN.Text>
          </RN.View>
          <RN.TextInput
            placeholder={'請輸入新增商品分類'}
            placeholderTextColor="gray"
            textAlign='left'
            value={formik.values.category}
            onChangeText={formik.handleChange("category")}
            style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer }]}
          />
          <RN.View style={styles.inputText}>
            <RN.Text style={[, { color: appCtx.Colors.errorText }]}>
              {formik.errors.category}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.TouchableOpacity style={styles.registerContainer} onPress={() => formik.submitForm()}>
          <RN.View style={[styles.registerText,{backgroundColor: appCtx.Colors.primary}]}>
            <RN.Text style={[{ color: appCtx.Colors.registerText, textAlign: 'center',  }]}>新增商品分類資料</RN.Text>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
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
