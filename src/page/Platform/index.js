import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import {useAppSelector} from '../../redux/store';
import Goback from '../../component/Goback';
import ReminderText from '../../component/ReminderText';
import SvgUri from 'react-native-svg-uri';

const PlatformPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [platform, setPlatform] = React.useState([]);

  const reduxToken = useAppSelector(state => state.token);

  const postPlatformRate = async () => {
    await appCtx.setLoading(true);
    // call api
    let submitData = {
      token: reduxToken,
    };
    const response = await service.postPlatformRate(submitData);
    if (!['', null, undefined].includes(response?.data)) {
      setPlatform(response.data);
    }
    await appCtx.setLoading(false);
  };

  const updateModifyRate = async item => {
    let submitData = {
      token: item,
    };
    const response = await service.updateModifyRate(submitData);
    if (response?.status === 'success') postPlatformRate();
  };

  const deleteModifyRate = async item => {
    let submitData = {
      id: item,
    };
    const response = await service.deleteModifyRate(submitData);
    if (response?.status === 'success') postPlatformRate();
  };

  const deleteItem = item => {
    RN.Alert.alert(
      '是否刪除',
      '',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => deleteModifyRate(item),
          style: 'OK',
        },
      ],
      {},
    );
  };

  React.useEffect(() => {
    postPlatformRate();
  }, [isFocused]);

  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <RN.View
        style={[
          styles.listContainer,
          {borderColor: appCtx.Colors.Platform.borderPrimary},
        ]}>
        <ReminderText text={'* 預設費用無法刪除'} />
        <ReminderText text={'* 長按可刪除分類別'} />
      </RN.View>

      <RN.ScrollView>
        <RN.View style={styles.container}>
          {platform.length > 0 ? (
            platform.map((item, index) => {
              return item.token !== '1' ? (
                <UI.Card
                  style={styles.itemContainer}
                  onPress={() => updateModifyRate(item.token)}
                  onLongPress={() => deleteItem(item._id)}
                  key={index}>
                  <RN.View style={styles.itemContent}>
                    <RN.Text style={styles.itemContentText}>
                      {item.label}
                    </RN.Text>
                    <RN.Text style={styles.itemContentText}>
                      {item.rate} %
                    </RN.Text>
                  </RN.View>
                  <RN.View style={styles.itemContent}>
                    {item.isActive ? (
                      <RN.Text style={styles.itemContentText}>進行中</RN.Text>
                    ) : (
                      <RN.Text style={styles.itemContentText}>啟用</RN.Text>
                    )}
                  </RN.View>
                </UI.Card>
              ) : (
                <UI.Card
                  style={styles.itemContainer}
                  key={index}
                  onPress={() => updateModifyRate(item.token)}>
                  <RN.View style={styles.itemContent}>
                    <RN.Text
                      style={[
                        styles.itemContentText,
                        {color: appCtx.Colors.platformDefault},
                      ]}>
                      {item.label}
                    </RN.Text>
                    <RN.Text
                      style={[
                        styles.itemContentText,
                        {color: appCtx.Colors.platformDefault},
                      ]}>
                      {item.rate} %
                    </RN.Text>
                  </RN.View>
                  <RN.View style={styles.itemContent}>
                    {item.isActive ? (
                      <RN.Text style={styles.itemContentText}>進行中</RN.Text>
                    ) : (
                      <RN.Text style={styles.itemContentText}>啟用</RN.Text>
                    )}
                  </RN.View>
                </UI.Card>
              );
            })
          ) : (
            <UI.Card style={styles.itemContainer}>
              <RN.View style={styles.itemContent}>
                <RN.Text style={{fontSize: 20}}>尚無資料</RN.Text>
              </RN.View>
            </UI.Card>
          )}
          <UI.Card
            style={styles.itemContainer}
            onPress={() => navigation.navigate('AddPlatformItem')}>
            <RN.View style={styles.itemContent}>
              <SvgUri
                width="25"
                height="25"
                source={require('../../assets/plus.svg')}
              />
            </RN.View>
          </UI.Card>
        </RN.View>
      </RN.ScrollView>
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
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    paddingLeft: 20,
    fontSize: 20,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  listText: {
    textAlign: 'center',
    margin: 2,
    fontSize: 12.5,
  },
});

export default PlatformPage;
