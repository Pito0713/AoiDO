import React from 'react';
import * as RN from 'react-native';
import {AppContext} from '../redux/AppContent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const DatePickerCOM = dateValue => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = date => {
    setSelectedDate(date);
    dateValue.onValueChange(date);
    setIsOpen(!isOpen);
  };
  const handleClick = e => {
    setIsOpen(!isOpen);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <RN.View style={{zIndex: 100}}>
      <RN.TouchableOpacity
        className="example-custom-input"
        onPress={handleClick}>
        <RN.Text
          style={{
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 15,
          }}>
          {moment(selectedDate).format('YYYY / MM / DD')}
        </RN.Text>
      </RN.TouchableOpacity>
      {isOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
        />
      )}
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({});

export default DatePickerCOM;
