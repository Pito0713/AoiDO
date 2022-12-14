import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';

import {useAppSelector} from '../redux/store';
import {AppContext} from '../redux/AppContent';
import service from '../page/Service/service';
import {useIsFocused} from '@react-navigation/native';

const Fillter = e => {
  const reduxToken = useAppSelector(state => state.token);
  const isFocused = useIsFocused();
  const appCtx = React.useContext(AppContext);
  const [showDialog, setShowDialog] = React.useState(false);
  const [disabledValue, setDisabledValue] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const postProductFilter = async () => {
    // call api
    let submitData = {
      token: reduxToken,
    };
    const response = await service.postProductFilter(submitData);
    if (!['', null, undefined].includes(response?.data))
      setCategoryList(response.data);
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
          <RN.Image
            source={require('../assets/filter.png')}
            style={{width: 20, height: 20}}
          />
        </RN.TouchableOpacity>
        <UI.Dialog
          useSafeArea
          top={true}
          panDirection={UI.Dialog.directions.DOWN}
          visible={showDialog}
          containerStyle={styles.dialog}
          ignoreBackgroundPress={false}
          onDismiss={() => show()}>
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
                  <UI.RadioButton
                    selected={disabledValue?.[item.category]}
                    onPress={() =>
                      setDisabledValue({
                        ...disabledValue,
                        [item.category]: !disabledValue?.[item.category],
                      })
                    }
                    label={item.category}
                    contentOnLeft
                    containerStyle={styles.contentOnLeft}
                  />
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
            <RN.Text style={[{color: appCtx.Colors.textPrimary}]}>確認</RN.Text>
          </RN.TouchableOpacity>
        </UI.Dialog>
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
