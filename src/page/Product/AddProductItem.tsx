import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { useFormik } from "formik";
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import service from "../Service/service";
import { useAppSelector } from '../../redux/store';
import ScrollViewComponent from "../../component/ScrollViewComponent";

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

interface Photo {
  fileName?: string,
  fileSize?: number,
  height?: number,
  type?: string,
  uri?: string
  width?: number
}

interface Item {
  describe?: string,
  price?: string,
  category?: string,
  remark?: string,
  quantity?: string,
}

interface CategoryItem {
  label?: string,
  value?: string,
}
const Content = () => {
  type Nav = {
    navigate: (route: string | undefined ,params:{isGo:boolean}) => void,
    goBack: () => void,
  }
  const appCtx = React.useContext(AppContext);

  const navigation = useNavigation<Nav>();
  const reduxToken = useAppSelector(state => state.token)
  const isFocused = useIsFocused();

  const [category, setCategory] = React.useState<CategoryItem>({
    label: '',
    value: '',
  });
  const [photo, setPhoto] = React.useState<Photo>({});
  const [isCategory, setIsCategory] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);

  const save = async (values: Item) => {
    if (values?.describe && values?.price && values?.quantity) {
      let target = await handleUploadPhoto()
      let submitData = {
        "describe": values.describe,
        "price": values.price,
        "quantity": values.quantity,
        "remark": values.remark,
        "category": category.value,
        "token": reduxToken,
        "imageUrl": target?.imageUrl,
      }
      if (target.imageUrl) {
        await appCtx.setLoading(true);
        const response = await service.postAddProduct(submitData);
        if (response?.status === 'success') navigation.goBack()
      }
      await appCtx.setLoading(false);
    }
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: "",
      price: "",
      remark: "",
      quantity: "",
    },
    validate: (values) => {
      const regDecimalto2 = /^\d+(\.\d{1,2})?$/
      const regNumber = /^\d+$/
      const errors: Item = {};

      if (!regDecimalto2.test(values.price)) errors.price = '*' + "必須數字且最多小數點後第2位";
      if (!regNumber.test(values.quantity)) errors.quantity = '*' + "必須數字";
      if (!category.label && !category.value) setIsCategory(true)
      else setIsCategory(false)

      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      save(values)
      resetForm()
      setCategory({ label: '', value: '' })
      setPhoto({})
    },
  });

  const createFormData = (photo: Photo) => {
    if (['image/jpg', 'image/jpeg', 'image/png'].includes(photo?.type as string)) {
      const data = new FormData();

      data.append('file', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
        // uri: RN.Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      });
      return data;
    } else {
      RN.Alert.alert('不支援圖片格式')
    }
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response: any) => {
      let target: Photo = {}
      if (!['', null, undefined].includes(response?.assets)) {
        target = response?.assets[0]
        if (['image/jpg', 'image/jpeg', 'image/png'].includes(target.type as string)) {
          setPhoto(target)
        } else RN.Alert.alert('不支援圖片格式')
      }
    });
  };

  const handleUploadPhoto = async () => {
    let submitData = createFormData(photo)
    if (submitData) {
      await appCtx.setLoading(true);
      const response = await service.postUploadImage(submitData);
      if (response?.data) return response.data
    }
    await appCtx.setLoading(false);

  };

  const postProductFilter = async () => {
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(( item:any )=>{
        return item.token !== '1'
      })
      setCategoryList(target)
    }
  }

  React.useEffect(() => {
    postProductFilter()
  }, []);

  return (
    <RN.ScrollView style={{ height: windowHeight - 100 }}>
      <RN.View style={styles.itemContainer}>
        <RN.TouchableOpacity onPress={handleChoosePhoto} style={{ borderWidth: 2, borderRadius: 10, overflow: 'hidden', marginBottom:20 }}>
          {photo?.uri ?
            <UI.View>
              <RN.Image
                source={{ uri: photo?.uri }}
                style={{ width: windowWidth * 3 / 4, height: windowHeight / 3 }}
              />
            </UI.View>
            :
            <UI.View style={{ width: windowWidth * 3 / 4, height: windowHeight / 3, justifyContent: 'center', alignItems: 'center', backgroundColor: appCtx.Colors.inputContainer }}>
              <UI.Text style={{ fontSize: 20 }}>點擊新增圖片</UI.Text>
            </UI.View>
          }
        </RN.TouchableOpacity>
        <RN.View>
          <RN.Text style={styles.itemContainerText}>商品描述</RN.Text>
          <RN.TextInput
            style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
            value={formik.values.describe}
            onChangeText={formik.handleChange("describe")}
            placeholder="描述"
          />
          <RN.View>
            <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.describe}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.Text style={styles.itemContainerText}>商品分類</RN.Text>
          <UI.Picker
            placeholder="選擇分類"
            value={!category.label && !category.value ? '' : category}
            enableModalBlur={false}
            onChange={(e: any) => { setCategory(e) }}
            topBarProps={{ title: '分類選項' }}
            style={[styles.picker, { backgroundColor: appCtx.Colors.inputContainer }]}
            showSearch
            searchPlaceholder={'搜尋'}
            migrateTextField
          >
            {categoryList.map((item: any, index) => (
              <UI.Picker.Item key={index} value={item?.category} label={item?.category} />
            ))}
          </UI.Picker>
          {isCategory ? <RN.View>
            <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {`* 必填`}
            </RN.Text>
          </RN.View>
            : <RN.View><RN.Text /></RN.View>
          }

        </RN.View>
        <RN.View >
          <RN.Text style={styles.itemContainerText}>商品價格</RN.Text>
          <RN.View style={{ borderWidth: 1.5, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
            <RN.TextInput
              style={[{ backgroundColor: appCtx.Colors.inputContainer, flex: 7, paddingLeft: 15, height: 45, }]}
              value={formik.values.price}
              onChangeText={formik.handleChange("price")}
              placeholder="商品價格"
              keyboardType="phone-pad"
            />
            <RN.TouchableOpacity
              style={[styles.transferContainer, { backgroundColor: appCtx.Colors.primary, flex: 3 }]}
              onPress={() => navigation.navigate('transfer', { isGo: true } )}
            >
              <RN.Text style={[{ color: appCtx.Colors.textPrimary }]}>換算</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View >
            <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.price}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View >
          <RN.Text style={styles.itemContainerText}>商品數量</RN.Text>
          <RN.View style={{ borderWidth: 1.5, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
            <RN.TextInput
              style={[{ backgroundColor: appCtx.Colors.inputContainer, flex: 7, paddingLeft: 15, height: 45, }]}
              value={formik.values.quantity}
              onChangeText={formik.handleChange("quantity")}
              placeholder="商品數量"
              keyboardType="phone-pad"
            />
          </RN.View>
          <RN.View >
            <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.quantity}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.Text style={styles.itemContainerText}>備註</RN.Text>
          <RN.TextInput
            style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
            value={formik.values.remark}
            onChangeText={formik.handleChange("remark")}
            placeholder="備註"
          />
          <RN.View >
            <RN.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.remark}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
            <RN.Text style={styles.saveContainerText}>保存</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    </RN.ScrollView>
  );
};

const AddProductItem = () => {
  const reduxPermission = useAppSelector(state => state.permission);
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      {reduxPermission !== 'admin' ? <RN.Text style={{fontSize: 20, marginLeft: 20}}>該帳戶無權限使用</RN.Text> : <ScrollViewComponent item={Content} />}
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    paddingLeft: 15,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  itemContainerText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 5
  },
  saveContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    marginTop: 40,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  saveContainerText: {
    textAlign: 'center'
  },
  transferContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    paddingLeft: 15,
    height: 45,
    marginBottom: -20,
    borderWidth: 1.5,
    borderRadius: 5,
  }
});

export default AddProductItem;