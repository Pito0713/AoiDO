import React from 'react';
import * as RN from 'react-native';
import {Picker} from '@react-native-picker/picker';
import numeral from 'numeral';
import {useIsFocused} from '@react-navigation/native';

import service from '../Service/service';
import {useAppSelector} from '../../redux/store';
import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback';
import ScrollViewComponent from '../../component/ScrollViewComponent';
import InputGroup from './InputGroup';

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Transfer = ({route}) => {
  const appCtx = React.useContext(AppContext);
  const isFocused = useIsFocused();
  const reduxToken = useAppSelector(state => state.token);
  const [exchange, setExchange] = React.useState('');
  const [exchangeValue, setExchangeValue] = React.useState(1);
  const [platform, setPlatform] = React.useState([]);
  const [platformValue, setPlatformValue] = React.useState('');

  const getExchange = async () => {
    let submitData = {
      currency: 'TWD',
    };
    // call api
    const response = await service.getExchange(submitData);
    if (!['', null, undefined].includes(response?.data))
      setExchange(response.data.rates);
  };

  const exchangeList = [
    {
      label: '人民幣',
      value: exchange?.CNY ? numeral(exchange.CNY).format('0.000') : 1,
    },
    {
      label: '日幣',
      value: exchange?.JPY ? numeral(exchange.JPY).format('0.000') : 1,
    },
    {
      label: '美金',
      value: exchange?.USD ? numeral(exchange.USD).format('0.000') : 1,
    },
    {
      label: '台幣',
      value: exchange?.TWD ? numeral(exchange.TWD).format('0.000') : 1,
    },
  ];

  const postPlatformRate = async () => {
    let submitData = {
      token: reduxToken,
    };
    const response = await service.postPlatformRate(submitData);
    if (!['', null, undefined].includes(response?.data))
      setPlatform(response.data);
  };

  const Content = () => {
    return !['', null, undefined].includes(exchangeValue) &&
      !['', null, undefined].includes(platformValue) ? (
      <InputGroup exchangeValue={exchangeValue} platformValue={platformValue} />
    ) : (
      <RN.View style={styles.choeseContent}>
        <RN.Text style={{fontSize: 25}}>請選擇貨幣跟平台</RN.Text>
      </RN.View>
    );
  };

  React.useEffect(() => {
    if (isFocused) getExchange();
    if (isFocused) postPlatformRate();
  }, [isFocused]);

  return (
    <RN.SafeAreaView style={styles.container}>
      {route?.params?.isGo && <Goback />}
      <RN.View style={[styles.pickerContainer]}>
        <RN.View
          style={[
            styles.pickerPickerContainer,
            {backgroundColor: appCtx.Colors.Transfer.cardTitle},
          ]}>
          <Picker
            selectedValue={exchangeValue}
            onValueChange={e => setExchangeValue(e)}
            style={[styles.pickerContent]}>
            {exchangeList.map((item, index) => (
              <Picker.Item key={index} value={item.value} label={item?.label} />
            ))}
          </Picker>
        </RN.View>
        <RN.View
          style={[
            styles.pickerPickerContainer,
            {backgroundColor: appCtx.Colors.Transfer.cardTitle},
          ]}>
          <Picker
            selectedValue={platformValue}
            onValueChange={e => setPlatformValue(e)}
            style={[
              styles.pickerContent,
              {borderColor: appCtx.Colors.borderColor},
            ]}>
            {platform.map((item, index) => (
              <Picker.Item key={index} value={item.rate} label={item?.label} />
            ))}
          </Picker>
        </RN.View>
      </RN.View>
      <ScrollViewComponent item={Content} />
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 30,
    flexDirection: 'row',
  },
  pickerPickerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  pickerContent: {
    textAlign: 'center',
    width: windowWidth / 2,
  },
  choeseContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight - 210,
  },
});

export default Transfer;
