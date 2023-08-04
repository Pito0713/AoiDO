import React from 'react';
import * as RN from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {AppContext} from '../redux/AppContent';
import service from '../page/Service/service';
import {useIsFocused} from '@react-navigation/native';
import Filter from '../assets/Filter';

const Fillter = e => {
  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext);
  const [showDialog, setShowDialog] = React.useState(false);
  const [disabledValue, setDisabledValue] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const postProductFilter = async () => {
    // call api
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(item => {
        return item.token !== '1';
      });
      setCategoryList(target);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (isFocused) await postProductFilter();
    })();
  }, [isFocused]);

  React.useEffect(() => {
    e.categoryValue(disabledValue);
  }, [disabledValue]);

  const show = () => {
    setShowDialog(!showDialog);
    e.ShowDialog(!showDialog);
  };

  return (
    <>
      <RN.View style={styles.container}>
        <RN.TouchableOpacity onPress={() => show()}>
          <Filter />
        </RN.TouchableOpacity>
        <RN.Modal
          animationType="slide"
          style={styles.dialog}
          visible={showDialog}>
          <RN.SafeAreaView>
            <RN.TouchableOpacity
              style={styles.cleanFillter}
              onPress={() => {
                setDisabledValue('');
              }}>
              <RN.Text>清除</RN.Text>
            </RN.TouchableOpacity>

            {categoryList.length > 0 &&
              categoryList.map((item, index) => {
                return (
                  <RN.View style={styles.dialogContent} key={index}>
                    <CheckBox
                      disabled={false}
                      value={disabledValue?.[item.category]}
                      onValueChange={() =>
                        setDisabledValue({
                          ...disabledValue,
                          [item.category]: !disabledValue?.[item.category],
                        })
                      }></CheckBox>
                    <RN.Text>{item.category}</RN.Text>
                  </RN.View>
                );
              })}
            <RN.TouchableOpacity
              style={[
                styles.confirmButton,
                {backgroundColor: appCtx.Colors.primary},
              ]}
              onPress={() => {
                setShowDialog(false);
                e.ShowDialog(false);
              }}>
              <RN.Text style={[{color: appCtx.Colors.textPrimary}]}>
                確認
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.SafeAreaView>
        </RN.Modal>
      </RN.View>
    </>
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});

export default Fillter;
