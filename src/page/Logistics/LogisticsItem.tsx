import React from "react";
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'
import { useFormik } from "formik";

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'
import service from "../Service/service";
import ScrollViewComponent from "../../component/ScrollViewComponent";

interface Item {
  describe?: string,
  singNumber?: string,
  remark?: string,
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
      "singNumber": values.singNumber,
      "startDate": new Date(startDate),
      "endDate": new Date(endDate),
      "remark": values.remark,
    }
      await appCtx.setLoading(true)
      const response = await service.patchUpdateCargo(submitData);
      await appCtx.setLoading(false)
      if (response?.status === 'success') navigation.goBack()
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: route.params?.item.describe ? route.params.item.describe : '',
      singNumber: route.params?.item.singNumber ? route.params.item.singNumber : '',
      remark: route.params?.item.remark ? route.params.item.remark : '',
    },
    validate: (values) => {
      const errors: Item = {};

      if (!values?.describe) errors.describe = '*' + "必填";
      if (!values?.singNumber) errors.singNumber = '*' + "必填";

      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      if (Date.parse(startDate) > Date.parse(endDate)) {
        RN.Alert.alert('出關時間必須大於開始運送時間')
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
          onPress: () => deleteCargo(route.params.item._id)
        }
      ], {}
    );
  }

  const deleteCargo = async (item: string) => {
    // call api
    await appCtx.setLoading(true)
    let submitData = {
      "id": item,
    }
    const response = await service.deleteCargo(submitData);
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
        <RN.Text style={styles.itemContainerText}>貨運單號</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("singNumber")}
          value={formik.values.singNumber}
          placeholder="貨運單號"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.singNumber as String} 
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>開始運送日期</RN.Text>
        <DatePicker value={startDate} onValueChange={onValueStartDatechange} />
        <RN.View><RN.Text/></RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>出關日期</RN.Text>
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

const LogisticsItem = ({ route }: { route: any }) => {
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
    marginTop: 25
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

export default LogisticsItem;