import React from 'react';
import moment from 'moment';
import * as RN from 'react-native';

import { AppContext } from '../../redux/AppContent';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import service from '../Service/service';

import Pagination from '../../component/Pagination';
import ReminderText from '../../component/ReminderText';
import { Plus, Search } from '../../assets';

const Coupon = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  const [init, setInit] = React.useState(false);
  const [coupon, setCoupon] = React.useState([]);
  const [text, setChangeText] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [pagination, setPagination] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  //  刷新用
  const onRefresh = () => {
    postSearchCoupon();
  };

  const onPageChange = page => {
    setPage(page);
  };

  // 搜尋優惠卷
  const postSearchCoupon = async () => {
    await appCtx.setLoading(true);
    let submitData = {
      searchText: text,
      page: page,
      pagination: pagination,
    };
    const response = await service.postSearchCoupon(submitData);
    if (response?.status == 'success') {
      setSearchText(text);
      setCoupon(response.data);
      setTotal(response.total);
    } else {
      // 失敗回傳空值
      setSearchText(text);
      setCoupon([]);
      setTotal(0)
    }
    await appCtx.setLoading(false);
  };

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
        setCoupon([]);
        setPage(1)
      }
    }, [])
  );

  React.useEffect(() => {
    postSearchCoupon();
  }, [page]);

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
            placeholder={'搜尋優惠'}
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
        <RN.TouchableOpacity
          style={[styles.addContainer]}
          onPress={() => {
            navigation.navigate('AddCouponItem'), setChangeText('');
          }}>
          <RN.View
            style={[
              styles.itemContent,
              { alignItems: 'center', justifyContent: 'center' },
            ]}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 右側按鈕 + 可新增商品 '} />
        <ReminderText text={'* 點擊項目可進入詳情頁'} />
        <ReminderText text={'* 搜尋框可進行模糊搜尋'} />
      </RN.View>
      <RN.ScrollView>
        {(coupon?.length > 0 && Array.isArray(coupon)) ? (
          coupon.map((item, index) => {
            return (
              <RN.TouchableOpacity
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: appCtx.Colors.Coupon.cardContainer,
                    borderColor: appCtx.Colors.Coupon.borderColor,
                  },
                ]}
                onPress={() => navigation.navigate('CouponItem', { item })}
                key={index}>
                <RN.View
                  style={[
                    styles.itemContent,
                    {
                      backgroundColor: appCtx.Colors.Coupon.cardTitle,
                      flex: 4,
                    },
                  ]}>
                  <RN.Text
                    style={[
                      styles.itemContentTextTitle,
                      { color: appCtx.Colors.textPrimary },
                    ]}>
                    {'描述'}
                  </RN.Text>
                  <RN.View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <RN.Text
                      style={[
                        {
                          color: appCtx.Colors.textPrimary,
                          fontSize: 20,
                          marginTop: 10,
                        },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {item.describe}
                    </RN.Text>
                  </RN.View>
                </RN.View>
                <RN.View
                  style={[
                    styles.itemContent,
                    {
                      flex: 6,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                    },
                  ]}>
                  <RN.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RN.Text style={styles.itemContentTextTitle}>
                      {'折扣價格'}
                    </RN.Text>
                    <RN.Text
                      style={[styles.itemContentText]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {item.discount}
                    </RN.Text>
                    <RN.Text style={[styles.itemContentTextTitle, { marginLeft: 15 }]}>
                      {'可使用次數'}
                    </RN.Text>
                    <RN.Text
                      style={[styles.itemContentText]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {item?.count}
                    </RN.Text>
                  </RN.View>
                  <RN.View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    <RN.Text style={styles.itemContentTextTitle}>
                      {'時間區間'}
                    </RN.Text>
                    <RN.Text
                      style={[styles.itemContentText, { fontSize: 10 }]}>
                      {moment(item.startDate).format('YYYY/MM/DD')} ~
                      {moment(item.endDate).format('YYYY/MM/DD')}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.TouchableOpacity>
            );
          })
        ) : (
          <RN.View
            style={[
              styles.itemContainer,
              {
                backgroundColor: appCtx.Colors.Coupon.cardContainer,
                borderColor: appCtx.Colors.Coupon.borderColor,
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
    height: windowHeight / 10,
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
    fontSize: 14,
  },
  itemContentText: {
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
});

export default Coupon;
