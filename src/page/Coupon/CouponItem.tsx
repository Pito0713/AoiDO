import React from "react";
import * as RN from 'react-native';
//@ts-ignore
import { useNavigation } from '@react-navigation/native';
//@ts-ignore
import moment from 'moment'
import { useFormik } from "formik";

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'
import ScrollViewComponent from "../../component/ScrollViewComponent";
import service from "../Service/service";

interface Item {
  id?: string | undefined,
  describe?: string | undefined,
  discount?: string | undefined,
  count?: string | undefined,
  remark?: string | undefined,
}

const Content = (route : { params: any }) => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation<Nav>();
  type Nav = {
    navigate: (value: string | undefined) => void,
    goBack: () => void,
  }

  const [startDate, setStartDate] = React.useState<string>(route.params?.item.startDate ? moment(route.params.item.startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
  const onValueStartDatechange = (e: any) => {
    setStartDate(moment(e).format('YYYY-MM-DD'))
  }
  const [endDate, setEndDate] = React.useState<string>(route.params?.item.endDate ? moment(route.params.item.endDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
  const onValueEndDatechange = (e: any) => {
    setEndDate(moment(e).format('YYYY-MM-DD'))
  }

  const save = async (values: Item) => {
    let submitData = {
      "id": route.params.item._id,
      "describe": values.describe,
      "discount": values.discount,
      "count": values.count,
      "startDate": new Date(startDate),
      "endDate": new Date(endDate),
      "remark": values.remark,
    }
    await appCtx.setLoading(true)
    const response = await service.patchUpdateCoupon(submitData);
    await appCtx.setLoading(false)
    if (response?.status === 'success') navigation.goBack()
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: route.params?.item.describe ? route.params.item.describe : '',
      discount: route.params?.item.discount ? route.params.item.discount : '',
      count: route.params?.item.count ? route.params.item.count : '',
      remark: route.params?.item.remark ? route.params.item.remark : '',
    },
    validate: (values:any) => {
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

  const deleteItem = () => {
    RN.Alert.alert(
      '是否刪除',
      "",
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: "確認",
          onPress: () => deleteOneCoupon(route.params.item._id)
        }
      ], {}
    );
  }

  const deleteOneCoupon = async (item: string) => {
    // call api
    await appCtx.setLoading(true)
    let submitData = {
      "id": item,
    }
    const response = await service.deleteOneCoupon(submitData);
    await appCtx.setLoading(false)
    if (response?.status === 'success') navigation.goBack()
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
            {formik.errors.describe as String}
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
            {formik.errors.discount as String}
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
        <RN.Text style={styles.itemContainerText}>開始日期</RN.Text>
        <DatePicker value={startDate} onValueChange={onValueStartDatechange} />
        <RN.View><RN.Text/></RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>結束日期</RN.Text>
        <DatePicker value={endDate} onValueChange={onValueEndDatechange} />
        <RN.View><RN.Text/></RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>備註</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("remark")}
          value={formik.values.remark}
          placeholder="備註"
        />
        <RN.View />
      </RN.View>
      <RN.View style={styles.buttomGroup}>
        <RN.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
          <RN.Text style={styles.saveContainerText}>保存</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity style={[styles.saveContainer]} onPress={() => deleteItem()}>
          <RN.Text style={styles.saveContainerText}>刪除</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

const CouponItem = ({ route }: { route: any }) => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={()=>Content(route)}/>
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    justifyContent: 'center',
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
    margin: 5
  },
  saveContainer: {
    flex: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    marginTop: 20,
    margin: 10,
    borderWidth: 1.5,
    borderRadius: 5
  },
  saveContainerText: {
    textAlign: 'center'
  },
  buttomGroup: {
    flexDirection: 'row',
    marginTop: 15,
  },
  pickerContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row'
  },
});

export default CouponItem;