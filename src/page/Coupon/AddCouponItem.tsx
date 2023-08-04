import React from "react";
import * as RN from 'react-native';
import { useFormik } from "formik";
//@ts-ignore
import moment from 'moment'
//@ts-ignore
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '../../redux/AppContent';
import { useAppSelector } from '../../redux/store';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'
import ScrollViewComponent from "../../component/ScrollViewComponent";
import service from "../Service/service";



interface Item {
  describe?: string | undefined,
  discount?: string | undefined,
  count?: string | undefined
  remark?: string | undefined,
}
const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector((state: { token: any; }) => state.token)

  const [startDate, setStartDate] = React.useState<string>(moment().format('YYYY-MM-DD'))
  const onValueStartDatechange = (e: any) => {
    setStartDate(moment(e).format('YYYY-MM-DD'))
  }
  const [endDate, setEndDate] = React.useState<string>(moment().format('YYYY-MM-DD'))
  const onValueEndDatechange = (e: any) => {
    setEndDate(moment(e).format('YYYY-MM-DD'))
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: '',
      discount: '',
      count: '',
      remark: '',
    },
    validate: (values: {
      count: any; describe: any; discount: string;
    }) => {
      const errors: Item = {};
      const reg = /^\d+$/

      if (!values?.describe) errors.describe = '*' + "必填";
      if (!values?.discount) errors.discount = '*' + "必填";
      if (!reg.test(values.discount)) errors.discount = '*' + "必須數字";

      if (!values?.count) errors.count = '*' + "必填";
      if (!reg.test(values.count)) errors.count = '*' + "必須數字";

      return errors;
    },
    onSubmit: (values: Item, { resetForm }: any) => {
      if (Date.parse(startDate) > Date.parse(endDate)) {
        RN.Alert.alert('結束時間必須大於開始時間')
      } else {
        save(values)
        resetForm()
      }
    },
  });

  const save = async (values: Item) => {
    let submitData = {
      describe: values.describe,
      discount: values.discount,
      count: values.count,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remark: values.remark,
      token: reduxToken,
    }
    await appCtx.setLoading(true)
    const response = await service.postCreateCoupon(submitData);
    await appCtx.setLoading(false)
    if (response?.message) navigation.goBack()
  }

  return (
    <RN.View style={styles.itemContainer}>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>描述</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("describe")}
          value={formik.values.describe}
          placeholder="描述"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.describe}
          </RN.Text>
        </RN.View>

      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>折扣價格</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("discount")}
          value={formik.values.discount}
          placeholder="折扣價格"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.discount}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>使用次數</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("count")}
          value={formik.values.count}
          placeholder="使用次數"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.count}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>開始日期</RN.Text>
        <DatePicker onValueChange={onValueStartDatechange} />
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>結束日期</RN.Text>
        <DatePicker onValueChange={onValueEndDatechange} />
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>備註</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("remark")}
          value={formik.values.remark}
          placeholder="備註"
        />
        <RN.View><RN.Text/></RN.View>
      </RN.View>
      <RN.View>
        <RN.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
          <RN.Text style={styles.saveContainerText}>保存</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

const AddCouponItem = () => {
  const reduxPermission = useAppSelector((state: { permission: any; }) => state.permission);
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      {reduxPermission !== 'admin' ? <RN.Text style={{fontSize: 20, marginLeft: 20}}>該帳戶無權限使用</RN.Text> : <ScrollViewComponent item={Content} />}
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    paddingLeft: 15,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5
  },
  itemContainerText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 8
  },
  saveContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 10,
    margin: 50,
    borderWidth: 1.5,
    borderRadius: 5
  },
  saveContainerText: {
    textAlign: 'center'
  },
});

export default AddCouponItem;