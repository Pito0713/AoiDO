import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import service from "../service/service";
import { AppContext } from '../../redux/AppContent';
import { useAppSelector } from '../../redux/store';
import Goback from '../../component/Goback'

const PlatformPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [platform, setPlatform] = React.useState([]);

  const reduxToken = useAppSelector(state => state.token)

  const postPlatformRate = async () => {
    // call api
    let submitData = {
      token: reduxToken
    }
    const response = await service.postPlatformRate(submitData);
    if (!['', null, undefined].includes(response?.data)) setPlatform(response.data)
  }

  const deleteModifyRate = async (item) => {
    let submitData = {
      id: item
    }
    const response = await service.deleteModifyRate(submitData);
    if (response?.status === 'success') await postPlatformRate()
  }

  const deleteItem = async (item) => {
    RN.Alert.alert(
      '是否刪除',
      "",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "確認",
          onPress: () => deleteModifyRate(item),
          style: "OK",
        },
      ], {}
    );
  }

  React.useEffect(() => {
    postPlatformRate()
  }, [isFocused])

  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <RN.ScrollView >
        <UI.View style={styles.container}>
          {platform.length > 0 ? platform.map((item, index) => {
            return (
              item.token !== '1' ?
                <UI.Card style={styles.itemContainer} onLongPress={() => deleteItem(item._id)} key={index}>
                  <UI.View style={styles.itemContent} >
                    <UI.Text style={styles.itemContentText} >{item.label}</UI.Text>
                    <UI.Text style={styles.itemContentText}>{item.rate}</UI.Text>
                  </UI.View>
                </UI.Card>
                :
                <UI.Card style={styles.itemContainer} key={index}>
                  <UI.View style={styles.itemContent} >
                    <UI.Text style={[styles.itemContentText, { color: appCtx.Colors.platformDefault }]}>{item.label}</UI.Text>
                    <UI.Text style={[styles.itemContentText, { color: appCtx.Colors.platformDefault }]}>{item.rate}</UI.Text>
                  </UI.View>
                </UI.Card>
            )
          }) :
            <UI.Card style={styles.itemContainer}>
              <UI.View style={styles.itemContent}>
                <UI.Text style={{ fontSize: 20 }}>尚無資料</UI.Text>
              </UI.View>
            </UI.Card>}
          <UI.Card style={styles.itemContainer} onPress={() => navigation.navigate('AddPlatformItem')}>
            <UI.View style={styles.itemContent}>
              <RN.Image
                source={require('../../assets/plus.png')}
                style={{ width: 25, height: 25 }}
              />
            </UI.View>
          </UI.Card>
        </UI.View>
      </RN.ScrollView >
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: 70,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    paddingLeft: 20,
    fontSize: 20
  }

});

export default PlatformPage;