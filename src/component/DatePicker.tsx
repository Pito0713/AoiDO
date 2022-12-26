import React from 'react';
import * as UI from 'react-native-ui-lib';
import * as RN from 'react-native';
import { AppContext } from '../redux/AppContent';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
interface dateValue {
  value?: any
  onValueChange?: (value: string) => void,
}

const DateTimePickerScreen = (dateValue: dateValue) => {
  const appCtx = React.useContext(AppContext) as any;
  const [date, setDate] = React.useState(dateValue?.value ? Date.parse(dateValue.value) : new Date())
  const [show, setShow] = React.useState(false);
  const showTimepicker = () => {
    setShow(true);
  };

  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate.nativeEvent.timestamp;
    setDate(currentDate);
    setShow(false);
    dateValue.onValueChange?.(currentDate)
  };

  return (
    <RN.ScrollView >
      <RN.View style={[styles.container]}>
        <RN.View style={[styles.content, { backgroundColor: appCtx.Colors.inputContainer }]}>
          <RN.Text style={{ paddingLeft: 15 }}>{moment(date).format('YYYY / MM / DD')}</RN.Text>
          {show && (
            <DateTimePicker
              value={new Date(date)}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </RN.View>
        <RN.TouchableOpacity style={styles.pickerText}>
          <RN.Text onPress={showTimepicker}>選擇日期</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.ScrollView>
  );
}
const styles = RN.StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  content: {
    flex: 7,
    width: '80%',
    height: 45,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 5
  },
  pickerText: {
    flex: 3,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default DateTimePickerScreen