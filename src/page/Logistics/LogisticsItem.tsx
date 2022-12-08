import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'
import { useNavigation } from '@react-navigation/native';
import service from "../Service/Service";
import moment from 'moment'
import { useFormik } from "formik";

const windowHeight = RN.Dimensions.get('window').height;

interface Item {
  describe?: string,
  singNumber?: string,
  remark?: string,
}

const LogisticsItem = ({ route }: { route: any }) => {
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
    if (Date.parse(startDate) > Date.parse(endDate)) {
      RN.Alert.alert('出關時間必須大於開始運送時間')
    } else {
      await appCtx.setLoading(true)
      const response = await service.patchUpdateCargo(submitData);
      await appCtx.setLoading(false)
      if (response?.status === 'success') navigation.navigate('logistics')
    }
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
    onSubmit: async (values, { resetForm }) => {
      await save(values)
      resetForm()
    },
  });

  const deleteItem = async () => {
    RN.Alert.alert(
      '是否刪除',
      "",
      [{
        text: "確認",
        onPress: () => deleteCargo(route.params.item._id)
      }], {}
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
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <RN.ScrollView >
        <RN.KeyboardAvoidingView keyboardVerticalOffset={windowHeight}>
          <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>

            <UI.View style={styles.itemContainer}>
              <UI.View>
                <UI.Text style={styles.itemContainerText}>描述</UI.Text>
                <RN.TextInput
                  style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
                  onChangeText={formik.handleChange("describe")}
                  value={formik.values.describe}
                  placeholder="描述"
                />
                {
                  formik.errors.describe ? <UI.View>
                    <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                      {formik.errors.describe}
                    </UI.Text>
                  </UI.View>
                    : <UI.View><UI.Text></UI.Text></UI.View>
                }
              </UI.View>
              <UI.View>
                <UI.Text style={styles.itemContainerText}>貨運單號</UI.Text>
                <RN.TextInput
                  style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
                  onChangeText={formik.handleChange("singNumber")}
                  value={formik.values.singNumber}
                  placeholder="貨運單號"
                />
                {
                  formik.errors.singNumber ? <UI.View>
                    <UI.Text style={[, { color: appCtx.Colors.errorText }]}>
                      {formik.errors.singNumber}
                    </UI.Text>
                  </UI.View>
                    : <UI.View><UI.Text></UI.Text></UI.View>
                }
              </UI.View>
              <UI.View>
                <UI.Text style={styles.itemContainerText}>開始運送日期</UI.Text>
                <DatePicker value={startDate} onValueChange={onValueStartDatechange} />
                <UI.View><UI.Text></UI.Text></UI.View>
              </UI.View>
              <UI.View>
                <UI.Text style={styles.itemContainerText}>出關日期</UI.Text>
                <DatePicker value={endDate} onValueChange={onValueEndDatechange} />
                <UI.View><UI.Text></UI.Text></UI.View>
              </UI.View>
              <UI.View>
                <UI.Text style={styles.itemContainerText}>備註</UI.Text>
                <RN.TextInput
                  style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
                  onChangeText={formik.handleChange("remark")}
                  value={formik.values.remark}
                  placeholder="備註"
                />
                <UI.View><UI.Text></UI.Text></UI.View>
              </UI.View>
              <UI.View style={styles.buttomGroup}>
                <UI.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
                  <UI.Text style={styles.saveContainerText}>保存</UI.Text>
                </UI.TouchableOpacity>
                <UI.TouchableOpacity style={[styles.saveContainer]} onPress={() => deleteItem()}>
                  <UI.Text style={styles.saveContainerText}>刪除</UI.Text>
                </UI.TouchableOpacity>
              </UI.View>
            </UI.View>
          </RN.TouchableOpacity>
        </RN.KeyboardAvoidingView>
      </RN.ScrollView>
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