import React from 'react';
import * as RN from 'react-native';
import { AppContext } from '../redux/AppContent';
//@ts-ignore
import RNDateTimePicker from '@react-native-community/datetimepicker';
//@ts-ignore
import moment from 'moment'

interface dateValue {
  value?: any
  onValueChange?: (value: string) => void,
}

const DateTimePickerScreen = (dateValue: dateValue) => {
  const [date, setDate] = React.useState(dateValue?.value ? Date.parse(dateValue.value) : new Date())
  const [show, setShow] = React.useState(false);
  const appCtx = React.useContext(AppContext) as any;

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
      {show && (
        <RNDateTimePicker
          value={new Date(date)}
          onChange={onChange}
          display="default"
        />
        )}
      </RN.View>
      <RN.TouchableOpacity  onPress={showTimepicker} style={[styles.pickerText,{backgroundColor: appCtx.Colors.inputContainer,}]}>
        <RN.Text style={{ paddingLeft: 15 }}>{moment(date).format('YYYY / MM / DD')}</RN.Text>
      </RN.TouchableOpacity>
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
    width: '80%',
    height: 45,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 5
  },
  pickerText: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default DateTimePickerScreen