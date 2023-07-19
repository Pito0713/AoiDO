import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import numeral from 'numeral';
import {useIsFocused} from '@react-navigation/native';

import service from '../Service/service';
import {useAppSelector} from '../../redux/store';
import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback';
import InputGroup from './InputGroup';
import ScrollViewComponent from '../../component/ScrollViewComponent';

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Transfer = ({route}) => {
  const appCtx = React.useContext(AppContext);
  const isFocused = useIsFocused();
  const reduxToken = useAppSelector(state => state.token);
  const [exchange, setExchange] = React.useState('');
  const [exchangeValue, setExchangeValue] = React.useState('');
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
      <RN.View
        style={[
          styles.pickerContainer,
          {backgroundColor: appCtx.Colors.Transfer.cardTitle},
        ]}>
        <UI.Picker
          placeholder="選擇貨幣"
          value={exchangeValue}
          enableModalBlur={false}
          onChange={e => setExchangeValue(e)}
          topBarProps={{title: '貨幣選項'}}
          style={[
            styles.pickerContent,
            {borderColor: appCtx.Colors.borderColor},
          ]}
          showSearch
          searchPlaceholder={'搜尋貨幣'}
          migrateTextField
          placeholderTextColor={appCtx.Colors.Transfer.cardTitleText}>
          {exchangeList.map((item, index) => (
            <UI.Picker.Item
              key={index}
              value={Number(item?.value)}
              label={item?.label}
              text={item?.text}
            />
          ))}
        </UI.Picker>
        <UI.Picker
          placeholder="選擇手續費"
          value={platformValue}
          enableModalBlur={false}
          onChange={e => setPlatformValue(e)}
          topBarProps={{title: 'coin'}}
          style={[
            styles.pickerContent,
            {borderColor: appCtx.Colors.borderColor},
          ]}
          showSearch
          searchPlaceholder={'Search a coin'}
          migrateTextField
          placeholderTextColor={appCtx.Colors.Transfer.cardTitleText}>
          {platform.map((item, index) => (
            <UI.Picker.Item
              key={index}
              value={item?.rate}
              label={item?.label}
            />
          ))}
        </UI.Picker>
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
  pickerContent: {
    height: 60,
    textAlign: 'center',
    width: windowWidth / 2,
    fontSize: 20,
    marginBottom: -20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  choeseContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight - 210,
  },
});

export default Transfer;
