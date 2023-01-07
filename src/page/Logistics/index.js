import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import {useAppSelector} from '../../redux/store';
import Pagination from '../../component/Pagination';

const Logistics = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [cargos, setCargos] = React.useState([]);
  const [text, onChangeText] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const reduxToken = useAppSelector(state => state.token);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pagination, setPagination] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    postSearchCargo();
    /// 預防請求失敗
    setRefreshing(false);
  };

  const onPageChange = page => {
    setPage(page);
  };

  const deleteItem = async item => {
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
          onPress: () => deleteCargo(item),
          style: 'OK',
        },
      ],
      {},
    );
  };

  const deleteCargo = async item => {
    // call api
    await appCtx.setLoading(true);
    let submitData = {
      id: item,
    };
    const response = await service.deleteCargo(submitData);
    if (response?.status === 'success') postSearchCargo();
    await appCtx.setLoading(false);
  };

  const postSearchCargo = async () => {
    // call api
    await appCtx.setLoading(true);
    let submitData = {
      searchText: text,
      token: reduxToken,
      page: page,
      pagination: pagination,
    };
    const response = await service.postSearchCargo(submitData);
    if (response.status == 'success') {
      setCargos(response.data);
      setTotal(response.total);
    }
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    if (isFocused) postSearchCargo();
  }, [isFocused]);

  React.useEffect(() => {
    postSearchCargo();
  }, [page]);

  return (
    <RN.SafeAreaView style={styles.container}>
      <RN.View style={styles.searchContainer}>
        <RN.View
          style={[
            styles.searchContent,
            {backgroundColor: appCtx.Colors.inputContainer},
          ]}>
          <RN.Image
            source={require('../../assets/search.png')}
            style={{width: 20, height: 20, marginLeft: 15}}
          />
          <RN.TextInput
            style={[
              styles.searchInput,
              {backgroundColor: appCtx.Colors.inputContainer},
            ]}
            onChangeText={onChangeText}
            value={text}
            placeholder={'搜尋貨運單號'}
            textAlign="left"
            placeholderTextColor="gray"
          />
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.searchContentText,
            {backgroundColor: appCtx.Colors.primary},
          ]}
          onPress={() => postSearchCargo()}>
          <RN.Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              flex: 1,
              color: appCtx.Colors.textPrimary,
            }}>
            搜尋
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={[styles.addContainer]}
          onPress={() => {
            navigation.navigate('AddLogisticsItem'), onChangeText('');
          }}>
          <RN.View
            style={[
              styles.itemContent,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <RN.Image
              source={require('../../assets/plus.png')}
              style={{width: 25, height: 25}}
            />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.ScrollView
        refreshControl={
          <RN.RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appCtx.Colors.primary]}
            tintColor={appCtx.Colors.primary}
            progressViewOffset={-5}
          />
        }>
        {cargos.length > 0 ? (
          cargos.map((item, index) => {
            return (
              <UI.Card
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: appCtx.Colors.Logistics.cardContianer,
                    borderColor: appCtx.Colors.Logistics.borderColor,
                  },
                ]}
                onPress={() => navigation.navigate('LogisticsItem', {item})}
                onLongPress={() => deleteItem(item._id)}
                key={index}>
                <RN.View
                  style={[
                    styles.itemContent,
                    {
                      backgroundColor: appCtx.Colors.Logistics.cardTitle,
                      flex: 3,
                    },
                  ]}>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      {color: appCtx.Colors.textPrimary},
                    ]}>
                    描述
                  </RN.Text>
                  <RN.View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <RN.Text
                      style={[{color: appCtx.Colors.textPrimary, fontSize: 20}]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {item.describe}
                    </RN.Text>
                  </RN.View>
                </RN.View>
                <RN.View style={[styles.itemContent, {flex: 7}]}>
                  <RN.Text style={styles.itemContentTextTitle}>
                    貨運單號
                  </RN.Text>
                  <RN.View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <RN.Text
                      style={[{fontSize: 20}]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {item.singNumber}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </UI.Card>
            );
          })
        ) : (
          <UI.Card
            style={[
              styles.itemContainer,
              {
                backgroundColor: appCtx.Colors.Logistics.cardContianer,
                borderColor: appCtx.Colors.Logistics.borderColor,
              },
            ]}>
            <RN.View
              style={[
                styles.itemContent,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <RN.Text style={{fontSize: 20}}>
                {searchText ? `搜尋 "${searchText}"  查無資料` : `尚無資料`}
              </RN.Text>
            </RN.View>
          </UI.Card>
        )}
      </RN.ScrollView>
      <Pagination
        page={page}
        pagination={pagination}
        total={total}
        onPageChange={onPageChange}
      />
    </RN.SafeAreaView>
  );
};

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: windowHeight / 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  itemContent: {
    height: '100%',
  },
  itemContentTextTitle: {
    margin: 5,
    marginBottom: 10,
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    margin: 10,
    width: windowWidth - 20,
  },
  searchContent: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1.5,
    borderRightWidth: 0,
    flex: 7.5,
  },
  searchContentText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    flex: 2.5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  searchInput: {
    marginLeft: 5,
    width: '100%',
    fontSize: 15,
  },
  addContainer: {
    width: '7.5%',
    margin: 10,
  },
});

export default Logistics;
