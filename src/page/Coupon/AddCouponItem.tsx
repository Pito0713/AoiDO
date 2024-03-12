import React from "react";
import * as RN from 'react-native';
import moment from 'moment'
import { useFormik } from "formik";
import { useNavigation } from '@react-navigation/native';

import { useAppSelector } from '../../redux/store';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'

// AES 加密
import CryptoJS from 'react-native-crypto-js';
// 金鑰
import { APP_SECRCT_KEY } from '../../env/config';

import service from "../Service/service";
const windowHeight = RN.Dimensions.get('window').height;
// type 
interface Item {
  describe?: string | undefined,
  discount?: string | undefined,
  count?: string | undefined,
  remark?: string | undefined,
}

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector((state: { token: any; }) => state.token)

  const [isTimeBetween, setIsTimeBetween] = React.useState(false);
  const [startDate, setStartDate] = React.useState<string>(moment().format('YYYY-MM-DD'))
  const onValueStartDateChange = (e: any) => {
    setStartDate(moment(e).format('YYYY-MM-DD'))
  }
  const [endDate, setEndDate] = React.useState<string>(moment().format('YYYY-MM-DD'))
  const onValueEndDateChange = (e: any) => {
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
    validate: (values: { describe: string; discount: string; count: string }) => {
      const errors: Item = {};
      const reg = /^\d+$/

      if (!values?.describe) errors.describe = '*' + "必填";
      if (!values?.discount) errors.discount = '*' + "必填";
      if (!reg.test(values.count)) errors.count = '*' + "必須數字";
      if (!reg.test(values.discount)) errors.discount = '*' + "必須數字";

      return errors;
    },
    onSubmit: (values: Item, { resetForm }: any) => {
      if (Date.parse(startDate) > Date.parse(endDate)) {
        setIsTimeBetween(true)
      } else {
        setIsTimeBetween(false)
        postCreateCoupon(values)
        resetForm()
      }
    },
  });

  const postCreateCoupon = async (values: Item) => {
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
    // 成功 返回上一頁
    if (response?.status === 'success') navigation.goBack()
  }

  return (
    <RN.View style={styles.itemContainer}>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'描述'}</RN.Text>
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
        <RN.Text style={styles.itemContainerText}>{'折扣價格'}</RN.Text>
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
            {formik.errors.count as String}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'開始日期'}</RN.Text>
        <RN.View style={[styles.pickerContainer, { backgroundColor: appCtx.Colors.inputContainer }]}>
          <DatePicker value={startDate} onValueChange={onValueStartDateChange} />
        </RN.View>
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {isTimeBetween ? "結束時間必須大於開始時間" : ''}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'結束日期'}</RN.Text>
        <RN.View style={[styles.pickerContainer, { backgroundColor: appCtx.Colors.inputContainer }]}>
          <DatePicker value={endDate} onValueChange={onValueEndDateChange} />
        </RN.View>
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {isTimeBetween ? "結束時間必須大於開始時間" : ''}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={{ zIndex: 1 }}>
        <RN.Text style={styles.itemContainerText}>{'備註'}</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("remark")}
          value={formik.values.remark}
          placeholder="備註"
        />
        <RN.View><RN.Text /></RN.View>
      </RN.View>
      <RN.View>
        <RN.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
          <RN.Text style={styles.saveContainerText}>{'保存'}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};
const AddCouponItem = () => {
  const reduxPermission = useAppSelector((state: { permission: any; }) => state.permission);
  // 解碼
  let bytes = CryptoJS.AES.decrypt(reduxPermission, APP_SECRCT_KEY);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  return (
    <RN.View style={styles.container}>
      <Goback />
      {originalText !== 'admin' ? <RN.Text style={{ fontSize: 20, marginLeft: 20 }}>{'該帳戶無權限使用'}</RN.Text> : <Content />}
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    alignSelf: 'center',
    marginTop: 20,
    height: windowHeight - 100
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
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 5,
    width: '100%',
    paddingLeft: 15,
  }
});

export default AddCouponItem;