import React from "react";
import * as RN from 'react-native';
import { useFormik } from "formik";
import moment from 'moment'
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import DatePicker from '../../component/DatePicker'
import service from "../Service/service";
import { useAppSelector } from '../../redux/store';
import ScrollViewComponent from "../../component/ScrollViewComponent";

const windowHeight = RN.Dimensions.get('window').height;

interface Item {
  describe?: string,
  singNumber?: string,
  remark?: string,
}
const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const reduxToken = useAppSelector(state => state.token)

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
      singNumber: '',
      remark: '',
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

  const save = async (values: Item) => {
    let submitData = {
      describe: values.describe,
      singNumber: values.singNumber,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remark: values.remark,
      token: reduxToken,
    }
    await appCtx.setLoading(true)
    const response = await service.postAddCargo(submitData);
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
        <RN.Text style={styles.itemContainerText}>貨運單號</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          onChangeText={formik.handleChange("singNumber")}
          value={formik.values.singNumber}
          placeholder="貨運單號"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText }]}>
            {formik.errors.singNumber}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>開始運送日期</RN.Text>
        <DatePicker onValueChange={onValueStartDatechange} />
        <RN.View><RN.Text/></RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>出關日期</RN.Text>
        <DatePicker onValueChange={onValueEndDatechange} />
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

const AddLogisticsItem = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={Content}/>
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
    margin: 5
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

export default AddLogisticsItem;