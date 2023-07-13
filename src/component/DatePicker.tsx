import React from 'react';
import * as RN from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
interface dateValue {
  value?: any
  onValueChange?: (value: string) => void,
}

const DateTimePickerScreen = (dateValue: dateValue) => {
  const [date, setDate] = React.useState(dateValue?.value ? Date.parse(dateValue.value) : new Date())

  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate.nativeEvent.timestamp;
    setDate(currentDate);
    dateValue.onValueChange?.(currentDate)
  };
  return (
    <RN.ScrollView >
      <RN.View style={[styles.container]}>
        <RNDateTimePicker
          value={new Date(date)}
          onChange={onChange}
          display="default"
        />
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