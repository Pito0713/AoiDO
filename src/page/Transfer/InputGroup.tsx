import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';

import numeral from 'numeral';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../redux/AppContent';

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
  // 平台費用
  const [platformCost, setPlatformCost] = React.useState<string | number>(0);
  // 平台運費
  const [platformLogistics, setPlatformLogistics] = React.useState<string | number>(0);
  // 負擔平台運費
  const [isPlatformLogistics, setIsPlatformLogistics] = React.useState<boolean>(false);
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

  // 平台費用轉換
  React.useEffect(() => {
    if (value?.platformValue?.value) setPlatformCost(numeral((Number(price) * platformValue)).format('0.00'))
  }, [price])

  React.useEffect(() => {
    if (
      ![0, '', null, undefined].includes(costPrice) &&
      ![0, '', null, undefined].includes(fare) &&
      ![0, '', null, undefined].includes(Packaging)
    ) {
      let transformCost = (Number(costPrice) / exchangeValue)
      let costTotal = Number(fare) + Number(Packaging) + Number(platformCost)

      let benefitPricetarget = 0
      let suggestedPricetarget = 0
      isPlatformLogistics ?
        suggestedPricetarget = Number(transformCost) + Number(costTotal) + (Number(transformCost) * Number(proportion) / 100) + Number(platformLogistics) :
        suggestedPricetarget = Number(transformCost) + Number(costTotal) + (Number(transformCost) * Number(proportion) / 100)
      isPlatformLogistics ?
        benefitPricetarget = Number(price) - Number(costTotal) - Number(transformCost) - Number(platformLogistics) :
        benefitPricetarget = Number(price) - Number(costTotal) - Number(transformCost)
      setBenefit(numeral(benefitPricetarget).format('0.00'))
      setSuggestedPrice(numeral(suggestedPricetarget).format('0.00'))
    }
  }, [costPrice, fare, Packaging, platformCost, price, proportion, isPlatformLogistics, platformLogistics])

  const cleaner = () => {
    setCostPrice(0)
    setFare(0)
    setPackaging(0)
    setPlatformCost(0)
    setPlatformLogistics(0)
    setIsPlatformLogistics(false)
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
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>成本價</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setCostPrice(Number(e)) : setCostPrice(e)}
          value={String(costPrice)}
          placeholder="成本價"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>{value.exchangeValue.label}</RN.Text>
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.costPriceTransform}> = {numeral(Number(costPrice) / exchangeValue).format('0.00')} TWD</RN.Text>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>商品運費</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setFare(Number(e)) : setFare(e)}
          value={String(fare)}
          placeholder="運費"
          keyboardType="numeric"
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
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
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
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
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.costPriceTransform}> 建議售價 = {numeral(suggestedPrice).format('0.00')} TWD</RN.Text>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>平台費用</RN.Text>
        <RN.View style={{ flexDirection: 'row', height: 40, flex: 7 }}>
          <RN.TextInput
            onChangeText={(e) => Number(e) !== 0 ? setPlatformCost(Number(e)) : setPlatformCost(e)}
            value={String(platformCost)}
            placeholder="平台費用"
            keyboardType="numeric"
            editable={false}
            style={{ borderWidth: 1, flex: 3, paddingLeft: 10 }}
          />
          <RN.View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <RN.Text style={styles.inputText}>平台匯率:  {value.platformValue.value * 100} %</RN.Text>
          </RN.View>
        </RN.View>
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>平台運費</RN.Text>
        <RN.View style={{ flexDirection: 'row', height: 40, flex: 7 }}>
          <RN.TextInput
            onChangeText={(e) => Number(e) !== 0 ? setPlatformLogistics(Number(e)) : setPlatformLogistics(e)}
            value={String(platformLogistics)}
            placeholder="平台運費"
            keyboardType="numeric"
            style={{ borderWidth: 1, flex: 3, paddingLeft: 10 }}
          />
          <RN.View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <RN.Text style={styles.inputText}>負擔平台運費</RN.Text>
            <UI.Switch value={isPlatformLogistics} onValueChange={() => setIsPlatformLogistics(!isPlatformLogistics)} />
          </RN.View>
        </RN.View>
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={{ textAlign: 'center', flex: 2.25 }}>收益佔比</RN.Text>
        <RN.View style={{ height: 40, flex: 4, justifyContent: 'center' }}>
          {isbenefitStyle ?
            <RN.View style={{ flexDirection: 'row' }}>
              <RN.TextInput
                onChangeText={(e) => Number(e) !== 0 ? setProportion(Number(e)) : setProportion(e)}
                value={String(proportion)}
                placeholder="收益佔比"
                keyboardType="numeric"
                style={{ borderWidth: 1, paddingLeft: 10 }}
              />
              <RN.Text style={styles.inputTextDescription}>%</RN.Text>
              <RN.View style={styles.inputTextDescription} />
            </RN.View>
            :
            <UI.View style={{ flexDirection: 'row' }}>
              <UI.Slider
                value={20}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={(e) => setProportion(e)}
                containerStyle={{ width: '90%' }}
                accessible={true}
              />
              <RN.Text style={{ paddingLeft: 15 }}>{proportion} %</RN.Text>
            </UI.View>
          }
        </RN.View>
        <RN.View style={{ justifyContent: 'center', flex: 3, alignItems: 'center' }}>
          <UI.Switch value={isbenefitStyle} onValueChange={() => setIsBenefitStyle(!isbenefitStyle)} />
        </RN.View>
      </RN.View>
      <RN.View style={styles.inputContainer}>
        <RN.Text style={styles.inputText}>收益</RN.Text>
        <RN.TextInput
          style={styles.input}
          onChangeText={(e) => Number(e) !== 0 ? setBenefit(Number(e)) : setBenefit(e)}
          value={String(benefit)}
          placeholder="收益"
          editable={false}
        />
        <RN.Text style={styles.exchangeValueText}>台幣</RN.Text>
        <RN.View style={styles.inputTextDescription} />
      </RN.View>
      <RN.TouchableOpacity style={styles.clearContent} onPress={() => cleaner()}>
        <RN.Text style={[styles.clearText, { backgroundColor: appCtx.Colors.inputContainer }]}>清空</RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};
const windowHeight = RN.Dimensions.get('window').height;
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight + 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    flex: 5,
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginLeft: 5,
    marginRight: 5,
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
    height: 40,
    flex: 1.5,
    textAlign: 'center',
    paddingTop: 12.5
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: -20,
  },
  costPriceTransform: {
    flex: 1,
    marginLeft: '25%'
  },
  clearContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    borderWidth: 1,
    textAlign: 'center',
    padding: 10,
    width: 100,
  }
});

export default InputGroup;