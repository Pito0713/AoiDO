import React from 'react';
import * as RN from 'react-native';

import { AppContext } from '../redux/AppContent';
import service from '../page/Service/service';
import { useIsFocused } from '@react-navigation/native';
import { Filter } from '../assets';

const Fillter = e => {
  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext);
  const [showDialog, setShowDialog] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);

  const postProductFilter = async () => {
    // call api
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(item => {
        return item.token !== '1';
      });
      target.forEach(item => {
        item.checked = false;
      });
      setCategoryList(target);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (isFocused) await postProductFilter();
    })();
  }, [isFocused]);

  const show = () => {
    setShowDialog(!showDialog);
    e.ShowDialog(!showDialog);
  };

  const handleCheckBoxChange = itemId => {
    const updatedData = categoryList.map(item =>
      item.category === itemId ? { ...item, checked: !item.checked } : item,
    );
    setCategoryList(updatedData);
    e.categoryValue(updatedData);
  };

  const renderItem = ({ item }) => (
    <RN.View style={styles.itemcontainer}>
      <RN.CheckBox
        value={item.checked}
        onValueChange={() => handleCheckBoxChange(item.category)}
      />
      <RN.Text style={styles.checkBoxText}>{item.category}</RN.Text>
    </RN.View>
  );

  return (
    <RN.View style={styles.container}>
      <RN.TouchableOpacity onPress={() => show()}>
        <Filter />
      </RN.TouchableOpacity>
      <RN.Modal
        animationType="slide"
        style={styles.dialog}
        visible={showDialog}>
        <RN.SafeAreaView>
          <RN.FlatList
            data={categoryList}
            renderItem={renderItem}
            keyExtractor={item => item.category}
          />
          <RN.TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: appCtx.Colors.primary },
            ]}
            onPress={() => {
              setShowDialog(false);
              e.ShowDialog(false);
            }}>
            <RN.Text style={[{ color: appCtx.Colors.textPrimary }]}>確認</RN.Text>
          </RN.TouchableOpacity>
        </RN.SafeAreaView>
      </RN.Modal>
    </RN.View>
  );
};
const width = RN.Dimensions.get('window').width;

const styles = RN.StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: 'row-reverse',
  },
  dialog: {
    backgroundColor: '#ffffff',
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dialogContent: {
    width: width / 2 - 40,
    padding: 15,
  },
  confirmButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    marginTop: 10,
  },
  cleanFillter: {
    flexDirection: 'row-reverse',
    padding: 15,
    width: '100%',
  },
  itemcontainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkBoxText: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default Fillter;
