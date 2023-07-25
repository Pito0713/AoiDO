import React from "react";
import * as RN from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';

import numeral from 'numeral';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../redux/AppContent';
import ReminderText from "../../component/ReminderText"

interface exchangeValue {
  exchangeValue: {
    [Key in string]?: string
  }
  platformValue: {
    label: string,
    value: number,
  }
}

const InputGroup = (value: exchangeValue) => {
  const exchangeValue = value?.exchangeValue?.value ? Number(value.exchangeValue.value) : 0
  const platformValue = value?.platformValue?.value ? Number(value.platformValue.value) : 0

  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext) as any;

  // 成本價
  const [costPrice, setCostPrice] = React.useState<string | number>(0);
  // 運費
  const [fare, setFare] = React.useState<string | number>(0);
  // 包裝費
  const [Packaging, setPackaging] = React.useState<string | number>(0);
  // 手續費用
  const [platformCost, setPlatformCost] = React.useState<string | number>(0);
  // 金流費用
  const [cashFeeCost, setCashFeeCost] = React.useState<string | number>(0);
  // 手續運費
  const [platformCoupon, setPlatformCoupon] = React.useState<string | number>(0);
  // 負擔手續運費
  const [isPlatformCoupon, setIsPlatformCoupon] = React.useState<boolean>(false);
  // 售價
  const [price, setPrice] = React.useState<string | number>(0);
  // 收益
  const [benefit, setBenefit] = React.useState<string | number>(0);
  // 收益圖形
  const [isbenefitStyle, setIsBenefitStyle] = React.useState<boolean>(false);
  // 建議售價
  const [suggestedPrice, setSuggestedPrice] = React.useState<string | number>(0);
  // 收益佔比
  const [proportion, setProportion] = React.useState<string | number>(20);

  // 手續費用轉換
  React.useEffect(() => {
    if (value?.platformValue?.value) setPlatformCost(numeral((Number(price) * platformValue)/100).format('0.00'))
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

  React.useEffect(() => {
    cleaner()
  }, [isFocused])

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
        <RN.Text style={styles.inputText}>成本</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setCostPrice(Number(e)) : setCostPrice(e)}
          value={String(costPrice)}
          placeholder="成本價"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>{value.exchangeValue.label}</RN.Text>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.costPriceTransform}> = {numeral(Number(costPrice) / exchangeValue).format('0.00')} TWD</RN.Text>
      </RN.View>

      {/* /* /* /* 商品運費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>商品國際運費</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setFare(Number(e)) : setFare(e)}
          value={String(fare)}
          placeholder="國際運費"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
      </RN.View>

      {/* /* /* /* 包裝費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>包裝費</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setPackaging(Number(e)) : setPackaging(e)}
          value={String(Packaging)}
          placeholder="包裝費"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
      </RN.View>

      {/* /* /* /* 售價 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>售價</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setPrice(Number(e)) : setPrice(e)}
          value={String(price)}
          placeholder="售價"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.costPriceTransform}> 建議售價 = {numeral(suggestedPrice).format('0.00')} TWD</RN.Text>
      </RN.View>

      {/* /* /* /* 手續費用 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>手續費用</RN.Text>
        <RN.View style={{ flexDirection: 'row', height: 40, flex: 7 }}>
          <RN.TextInput
            onChangeText={(e) => Number(e) !== 0 ? setPlatformCost(Number(e)) : setPlatformCost(e)}
            value={String(platformCost)}
            placeholder="手續費用"
            keyboardType="numeric"
            editable={false}
            style={{ borderWidth: 1.5, flex: 3, paddingLeft: 10, borderRadius: 5, height: 45, }}
          />
          <RN.View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <RN.Text style={styles.inputText}>手續匯率:  {value.platformValue.value} %</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>

      {/* /* /* /* 金流費用 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={{ textAlign: 'center', flex: 3 }}>金流費用</RN.Text>
        <RN.View style={{ flex: 3, justifyContent: 'center' }}>
          <RN.TextInput
            onChangeText={(e) => Number(e) !== 0 ? setCashFeeCost(Number(e)) : setCashFeeCost(e)}
            value={String(cashFeeCost)}
            placeholder="金流費用"
            keyboardType="numeric"
            style={{ borderWidth: 1.5, paddingLeft: 10, borderRadius: 5, height: 45, }}
          />
        </RN.View>
        <RN.Text style={styles.inputTextDescription}>%</RN.Text>
        <RN.Text style={{ flex: 4.5 }}></RN.Text>
      </RN.View>

      {/* /* /* /* 手續運費 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>手續運費</RN.Text>
        <RN.View style={{ flexDirection: 'row', height: 40, flex: 7 }}>
          <RN.TextInput
            onChangeText={(e) => Number(e) !== 0 ? setPlatformCoupon(Number(e)) : setPlatformCoupon(e)}
            value={String(platformCoupon)}
            placeholder="手續運費"
            keyboardType="numeric"
            style={{ borderWidth: 1.5, flex: 3, paddingLeft: 10, height: 45, borderRadius: 5 }}
          />
          <RN.View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <RN.Text style={styles.inputText}>負擔手續運費</RN.Text>
            <RN.Switch value={isPlatformCoupon} onValueChange={() => setIsPlatformCoupon(!isPlatformCoupon)} />
          </RN.View>
        </RN.View>
      </RN.View>

      {/* /* /* /* 收益佔比 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={{ textAlign: 'center', flex: 2.25 }}>收益佔比</RN.Text>
        <RN.View style={{ flex: 3.25, justifyContent: 'center' }}>
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
                onValueChange={(e) => setProportion(e)}
                containerStyle={{ width: '90%' }}

              />
              <RN.Text style={{ paddingLeft: 15 }}>{proportion} %</RN.Text>
            </RN.View>
          }
        </RN.View>
        <RN.View style={{ justifyContent: 'center', flex: 3, alignItems: 'center' }}>
          <RN.Switch value={isbenefitStyle} onValueChange={() => setIsBenefitStyle(!isbenefitStyle)} />
        </RN.View>
      </RN.View>

      {/* /* /* /* 收益 */}
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>預計收益</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setBenefit(Number(e)) : setBenefit(e)}
          value={String(benefit)}
          placeholder="收益"
          editable={false}
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
      </RN.View>
      <RN.TouchableOpacity style={styles.clearContent} onPress={() => cleaner()}>
        <RN.Text style={[styles.clearText, { backgroundColor: appCtx.Colors.inputContainer }]}>清空</RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 45,
    borderWidth: 1.5,
    flex: 5,
    paddingLeft: 10,
    borderRadius: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17.5,
    marginLeft: 7.5,
    marginRight: 7.5,
  },
  inputText: {
    textAlign: 'center',
    flex: 2.5,
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
    flex: 1,
    marginLeft: '24%'
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

export default InputGroup;