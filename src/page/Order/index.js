import React from 'react';
import * as RN from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import service from '../Service/service';
import { AppContext } from '../../redux/AppContent';
import Pagination from '../../component/Pagination';
import ReminderText from '../../component/ReminderText';
import { Search } from '../../assets';

const Order = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  // 初始化
  const [init, setInit] = React.useState(false);

  const [order, setOrder] = React.useState([]);
  const [text, setChangeText] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [pagination, setPagination] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  //  刷新用
  const onRefresh = () => {
    postSearchOrder()
  };

  const onPageChange = page => {
    setPage(page);
  };

  // 搜尋訂單
  const postSearchOrder = async () => {
    await appCtx.setLoading(true);
    let submitData = {
      searchText: text,
      page: page,
      pagination: pagination,
    };
    const response = await service.postSearchOrder(submitData);

    if (response?.status == 'success') {
      setSearchText(text);
      setOrder(response.data);
      setTotal(response.total);
    } else {
      // 失敗回傳空值
      setSearchText(text);
      setOrder([]);
      setTotal(0)
    }
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    postSearchOrder();
  }, [page]);

  React.useEffect(() => {
    if (init) {
      onRefresh()
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setChangeText('');
        setSearchText('');
        setOrder([]);
        setPage(1)
      }
    }, [])
  );

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.searchContainer}>
        <RN.View
          style={[
            styles.searchContent,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}>
          <RN.View style={[{ marginLeft: 10 }]}>
            <Search />
          </RN.View>
          <RN.TextInput
            style={[
              styles.searchInput,
              { backgroundColor: appCtx.Colors.inputContainer },
            ]}
            setChangeText={setChangeText}
            value={text}
            placeholder={'搜尋會員名稱'}
            textAlign="left"
            placeholderTextColor="gray"
          />
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.searchContentText,
            { backgroundColor: appCtx.Colors.primary },
          ]}
          onPress={() => onRefresh()}>
          <RN.Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              flex: 1,
              color: appCtx.Colors.textPrimary,
            }}>
            {'搜尋'}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 點擊項目可進入詳情頁'} />
        <ReminderText text={'* 搜尋框可進行模糊搜尋'} />
      </RN.View>
      <RN.ScrollView>
        {(order?.length > 0 && Array.isArray(order)) ? (
          order.map((item, index) => {
            return (
              <RN.TouchableOpacity
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: appCtx.Colors.Order.cardContainer,
                    borderColor: appCtx.Colors.Order.borderColor,
                  },
                ]}
                onPress={() => navigation.navigate('OrderItem', { item })}
                key={index}>
                <RN.View
                  style={[
                    styles.itemContent,
                    {
                      backgroundColor: appCtx.Colors.Order.cardTitle,
                      flex: 4,
                    },
                  ]}>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 12 },
                    ]}>
                    {'會員名稱:'}
                  </RN.Text>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 10 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {item.infoData.userName}
                  </RN.Text>

                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 12 },
                    ]}>
                    {'地址: '}
                  </RN.Text>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 10 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {`${item.infoData.city} ${item.infoData.town} ${item.infoData.address}`}
                  </RN.Text>

                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 12 },
                    ]}>
                    {'創立時間: '}
                  </RN.Text>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary, fontSize: 10 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {moment(item.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                  </RN.Text>
                </RN.View>
                <RN.View
                  style={[
                    styles.itemContent,
                    {
                      flex: 6,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      padding: 5,
                    },
                  ]}>
                  {item.ProductList.map((item, index) => {
                    return (
                      <RN.View
                        style={[
                          {
                            alignItems: 'flex-start',
                            justifyContent: 'space-around',
                            flexDirection: 'row',
                            padding: 5,
                          },
                        ]}
                        key={item.imageUrl + index}>
                        <RN.Image
                          source={{ uri: `${item.imageUrl}` }}
                          style={{ width: 25, height: 25 }}
                        />
                        <RN.Text
                          style={{
                            width: '40%',
                          }}>{`名稱:  ${item.describe}`}</RN.Text>
                        <RN.Text
                          style={{
                            width: '40%',
                          }}>{`數量:  ${item.quantity}`}</RN.Text>
                      </RN.View>
                    );
                  })}
                </RN.View>
              </RN.TouchableOpacity>
            );
          })
        ) : (
          <RN.View
            style={[
              styles.itemContainer,
              {
                backgroundColor: appCtx.Colors.Order.cardContainer,
                borderColor: appCtx.Colors.Order.borderColor,
              },
            ]}>
            <RN.View
              style={[
                styles.itemContent,
                { alignItems: 'center', justifyContent: 'center' },
              ]}>
              <RN.Text style={{ fontSize: 20 }}>
                {searchText ? `搜尋 "${searchText}"  查無資料` : `尚無資料`}
              </RN.Text>
            </RN.View>
          </RN.View>
        )}
      </RN.ScrollView>
      <Pagination
        page={page}
        pagination={pagination}
        total={total}
        onPageChange={onPageChange}
      />
    </RN.View>
  );
};

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: windowHeight / 5,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  itemContent: {
    height: '100%',
  },
  itemContentTextTitle: {
    marginLeft: 5,
    marginTop: 5,
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
    paddingLeft: 10,
    width: '100%',
    fontSize: 15,
    height: '99%',
  },
  addContainer: {
    width: '7.5%',
    margin: 10,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  orderProudctContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});

export default Order;
