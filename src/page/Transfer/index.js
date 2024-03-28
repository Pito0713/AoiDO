import React from 'react';
import * as RN from 'react-native';
import { Picker } from '@react-native-picker/picker';
import numeral from 'numeral';
import { useFocusEffect } from '@react-navigation/native';
import { Slider } from '@miblanchard/react-native-slider';

import service from '../Service/service';
import { useAppSelector } from '../../redux/store';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback';
import InputGroup from './InputGroup';
import ReminderText from "../../component/ReminderText"

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Content = (value) => {
  const appCtx = React.useContext(AppContext);
  const exchangeValue = value?.exchangeValue?.value ? Number(value.exchangeValue.value) : 0
  const platformValue = value?.platformValue?.value ? Number(value.platformValue.value) : 0

  // 成本價
  const [costPrice, setCostPrice] = React.useState(0);
  // 運費
  const [fare, setFare] = React.useState(0);
  // 包裝費
  const [Packaging, setPackaging] = React.useState(0);
  // 手續費用
  const [platformCost, setPlatformCost] = React.useState(0);
  // 金流費用
  const [cashFeeCost, setCashFeeCost] = React.useState(0);
  // 手續運費
  const [platformCoupon, setPlatformCoupon] = React.useState(0);
  // 負擔手續運費
  const [isPlatformCoupon, setIsPlatformCoupon] = React.useState(false);
  // 售價
  const [price, setPrice] = React.useState(0);
  // 收益
  const [benefit, setBenefit] = React.useState(0);
  // 收益圖形
  const [isbenefitStyle, setIsBenefitStyle] = React.useState(false);
  // 建議售價
  const [suggestedPrice, setSuggestedPrice] = React.useState(0);
  // 收益佔比
  const [proportion, setProportion] = React.useState(20);

  // 手續費用轉換
  React.useEffect(() => {
    if (value?.platformValue?.value) setPlatformCost(numeral((Number(price) * platformValue) / 100).format('0.00'))
  }, [price])

  React.useEffect(() => {
    if (
      ![0, '', null, undefined].includes(costPrice)
    ) {
      // 成本
      let transformCost = (Number(costPrice) / exchangeValue)
      // 商品運費 + 包裝費 + 手續費用 + 手續費
      let costTotal = Number(fare) + Number(Packaging) + Number(platformCost) + (Number(price) * Number(cashFeeCost) / 100)

      let benefitPricetarget = 0
      let suggestedPricetarget = 0
      isPlatformCoupon ?
        // 成本 + 商品國際運費 + 包裝費 + 手續費用 + 手續費 + 預計收益佔比 + 運費
        suggestedPricetarget = Number(transformCost) + Number(costTotal) + (Number(transformCost) * Number(proportion) / 100) + Number(platformCoupon) :
        suggestedPricetarget = Number(transformCost) + Number(costTotal) + (Number(transformCost) * Number(proportion) / 100)
      isPlatformCoupon ?
        // 售價 - 商品國際運費 - 包裝費 - 手續費用 - 手續費 - 成本 - 運費
        benefitPricetarget = Number(price) - Number(costTotal) - Number(transformCost) - Number(platformCoupon) :
        benefitPricetarget = Number(price) - Number(costTotal) - Number(transformCost)
      setBenefit(numeral(benefitPricetarget).format('0.00'))
      setSuggestedPrice(numeral(suggestedPricetarget).format('0.00'))
    }
  }, [costPrice, fare, Packaging, platformCost, price, proportion, isPlatformCoupon, platformCoupon, cashFeeCost])


  const cleaner = () => {
    setCostPrice(0)
    setFare(0)
    setPackaging(0)
    setPlatformCost(0)
    setPlatformCoupon(0)
    setIsPlatformCoupon(false)
    setPrice(0)
    setBenefit(0)
    setSuggestedPrice(0)
    setProportion(20)
  }



  console.log(Number(costPrice), 'costPrice')
  console.log(Number(exchangeValue), 'exchangeValue')

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.listContainer}>
        <ReminderText text={'* 基本成本 = 成本 + 商品國際運費 + 包裝費 + 手續運費'} />
        <ReminderText text={'* 總手續費 = 售價 * 金流費用% + 售價 * 手續費用%'} />
        <ReminderText text={'* 預計收益 = 售價 - 基本成本 - 總手續費'} />
        <ReminderText text={'* 建議售價 = 基本成本 + 總手續費 + 收益佔比'} />
      </RN.View>
      {/* /* /* /* 成本價 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>{'成本'}</RN.Text>
        <RN.TextInput
          style={[styles.input, { flex: 6 }]}
          onChangeText={(e) => Number(e) !== 0 ? setCostPrice(Number(e)) : setCostPrice(e)}
          placeholder="請輸入成本"
          keyboardType="numeric"
        />
        <RN.Text style={{ flex: 2 }}> = {numeral(Number(costPrice) / Number(exchangeValue)).format('0.00')} TWD</RN.Text>
      </RN.View>

      {/* /* /* /* 商品運費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>商品國際運費</RN.Text>
        <RN.TextInput
          style={[styles.input, { flex: 6 }]}
          onChangeText={(e) => Number(e) !== 0 ? setFare(Number(e)) : setFare(e)}
          value={String(fare)}
          placeholder="國際運費"
          keyboardType="numeric"
        />
        <RN.Text style={{ flex: 2 }}>台幣</RN.Text>
      </RN.View>

      {/* /* /* /* 包裝費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>包裝費</RN.Text>
        <RN.TextInput
          style={[styles.input, { flex: 6 }]}
          onChangeText={(e) => Number(e) !== 0 ? setPackaging(Number(e)) : setPackaging(e)}
          value={String(Packaging)}
          placeholder="包裝費"
          keyboardType="numeric"
        />
        <RN.Text style={{ flex: 2 }}>台幣</RN.Text>
      </RN.View>

      {/* /* /* /* 售價 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>售價</RN.Text>
        <RN.TextInput
          style={[styles.input, { flex: 6 }]}
          onChangeText={(e) => Number(e) !== 0 ? setPrice(Number(e)) : setPrice(e)}
          value={String(price)}
          placeholder="售價"
          keyboardType="numeric"
        />
        <RN.Text style={{ flex: 2 }}>台幣</RN.Text>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.costPriceTransform}> 建議售價 = {numeral(suggestedPrice).format('0.00')} TWD</RN.Text>
      </RN.View>

      {/* /* /* /* 手續費用 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>手續費用</RN.Text>

        <RN.TextInput
          onChangeText={(e) => Number(e) !== 0 ? setPlatformCost(Number(e)) : setPlatformCost(e)}
          value={String(platformCost)}
          placeholder="手續費用"
          keyboardType="numeric"
          editable={false}
          style={[styles.input, { flex: 6 }]}
        />
        <RN.Text style={{ flex: 2 }}>手續匯率:  {value.platformValue.value} %</RN.Text>
      </RN.View>

      {/* /* /* /* 金流費用 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>金流費用</RN.Text>

        <RN.TextInput
          onChangeText={(e) => Number(e) !== 0 ? setCashFeeCost(Number(e)) : setCashFeeCost(e)}
          value={String(cashFeeCost)}
          placeholder="金流費用"
          keyboardType="numeric"
          style={[styles.input, { flex: 6 }]}
        />
        <RN.Text style={{ flex: 2 }}>%</RN.Text>
      </RN.View>

      {/* /* /* /* 手續運費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>手續運費</RN.Text>

        <RN.TextInput
          onChangeText={(e) => Number(e) !== 0 ? setPlatformCoupon(Number(e)) : setPlatformCoupon(e)}
          value={String(platformCoupon)}
          placeholder="手續運費"
          keyboardType="numeric"
          style={[styles.input, { flex: 6 }]}
        />
        <RN.View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <RN.Text style={styles.inputText}>負擔手續運費</RN.Text>
          <RN.Switch value={isPlatformCoupon} onValueChange={() => setIsPlatformCoupon(!isPlatformCoupon)} />
        </RN.View>

      </RN.View>

      {/* /* /* /* 收益佔比 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>收益佔比</RN.Text>
        <RN.View style={{ flex: 6, justifyContent: 'center' }}>
          {isbenefitStyle ?
            <RN.View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RN.TextInput
                onChangeText={(e) => Number(e) !== 0 ? setProportion(Number(e)) : setProportion(e)}
                value={String(proportion)}
                placeholder="收益佔比"
                keyboardType="numeric"
                style={{ borderWidth: 1.5, paddingLeft: 10, flex: 3, height: 45, borderRadius: 5 }}
              />
              <RN.Text style={styles.inputTextDescription}>%</RN.Text>
            </RN.View>
            :
            <RN.View style={{ flexDirection: 'row' }}>
              <Slider
                value={20}
                minimumValue={0}
                maximumValue={100}
                step={5}
                // onValueChange={(e) => setProportion(e)}
                containerStyle={{ width: '90%' }}

              />
              <RN.Text style={{ paddingLeft: 15 }}>{proportion} %</RN.Text>
            </RN.View>
          }
        </RN.View>
        <RN.View style={{ justifyContent: 'center', flex: 2, alignItems: 'center' }}>
          <RN.Switch value={isbenefitStyle} onValueChange={() => setIsBenefitStyle(!isbenefitStyle)} />
        </RN.View>
      </RN.View>

      {/* /* /* /* 收益 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={[styles.inputText, { flex: 2, backgroundColor: appCtx.Colors.Transfer.Title }]}>預計收益</RN.Text>
        <RN.TextInput
          style={[styles.input, { flex: 6 }]}
          onChangeText={(e) => Number(e) !== 0 ? setBenefit(Number(e)) : setBenefit(e)}
          value={String(benefit)}
          placeholder="收益"
          editable={false}
        />
        <RN.Text style={{ flex: 2 }}>台幣</RN.Text>
      </RN.View>
      <RN.TouchableOpacity style={styles.clearContent} onPress={() => cleaner()}>
        <RN.Text style={[styles.clearText, { backgroundColor: appCtx.Colors.inputContainer }]}>清空</RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const Transfer = ({ route }) => {
  const appCtx = React.useContext(AppContext);
  const reduxToken = useAppSelector(state => state.token);

  const [init, setInit] = React.useState(false);
  const [exchange, setExchange] = React.useState('');
  const [exchangeValue, setExchangeValue] = React.useState('');
  const [platform, setPlatform] = React.useState([]);
  const [platformValue, setPlatformValue] = React.useState('');

  const getExchange = async () => {
    let submitData = {
      currency: 'TWD',
    };

    const response = await service.getExchange(submitData);
    if (!['', null, undefined].includes(response?.data)) {
      setExchange(response.data.rates);
      setExchangeValue(response.data.rates?.CNY ? numeral(response.data.rates?.CNY).format('0.000') : 1)
    }
  };

  const exchangeList = React.useMemo(() =>
    [
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
    ]
    , [exchange])


  const postPlatformRate = async () => {
    let submitData = {
      token: reduxToken,
    };
    const response = await service.postPlatformRate(submitData);
    if (!['', null, undefined].includes(response?.data)) {
      setPlatform(response.data);
      setPlatformValue(response.data[0]?.rate);
    }
  };




  React.useEffect(() => {
    if (init) {
      getExchange();
      postPlatformRate();
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setExchange('');
        setExchangeValue('');
        setPlatform([]);
        setPlatformValue('');
      }
    }, [])
  );

  return (
    <RN.View style={styles.container}>
      {route?.params?.isGo && <Goback />}
      <RN.View style={[styles.pickerContainer]}>
        <Picker
          selectedValue={exchangeValue}
          onValueChange={e => setExchangeValue(e)}
          style={[styles.pickerContent]}>
          {exchangeList.map((item, index) => (
            <Picker.Item
              key={index}
              value={Number(item?.value)}
              label={item?.label}
              text={item?.text}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={platformValue}
          onValueChange={e => setPlatformValue(e)}
          style={[
            styles.pickerContent,
            { borderColor: appCtx.Colors.borderColor },
          ]}>
          {platform.map((item, index) => (
            <Picker.Item key={index} value={item?.rate} label={item?.label} />
          ))}
        </Picker>
      </RN.View>
      <Content exchangeValue={exchangeValue} platformValue={platformValue} />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    textAlign: 'center',
    width: 200,
    height: 35,
    marginHorizontal: 20,
    borderRadius: 5
  },
  chooseContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight - 210,
  },
  input: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 45,
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 100,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 45,
    overflow: 'hidden',
  },
  inputText: {
    textAlign: 'center',
    height: '100%',
    alignContent: 'center',

  },
  inputTextDescription: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  exchangeValueText: {
    height: 45,
    flex: 1.5,
    textAlign: 'center',
    paddingTop: 12
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: -20,
  },
  costPriceTransform: {

  },
  clearContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  clearText: {
    width: 100,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
    textAlign: 'center',
    paddingTop: 12
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 25,
    flexWrap: 'wrap',
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10
  },
  listText: {
    textAlign: 'center',
    margin: 2,
    fontSize: 12.5,
  }
});

export default Transfer;
