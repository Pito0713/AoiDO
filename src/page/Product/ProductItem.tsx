import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import service from "../Service/Service";
import { useAppSelector } from '../../redux/store';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFormik } from "formik";
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

interface PhotoItem {
  describe?: string,
  price?: string,
  remark?: string,
}

interface CategoryItem {
  label?: string,
  value?: string,
}

const Content = (route: { params: any }) => {
  const appCtx = React.useContext(AppContext);
  const [photo, setPhoto] = React.useState(route.params?.item.imageUrl ? route.params.item.imageUrl : '');
  const [orgialPhoto, setOrgialPhoto] = React.useState(route.params?.item.imageUrl ? route.params.item.imageUrl : '');
  const [category, setCategory] = React.useState<CategoryItem>({
    label: '',
    value: '',
  });
  const [categoryList, setCategoryList] = React.useState([]);
  const navigation = useNavigation();
  const reduxToken = useAppSelector(state => state.token)
  const isFocused = useIsFocused();

  const save = async (values: PhotoItem) => {
    if (values?.describe && values?.price) {
      await appCtx.setLoading(true);
      let target = orgialPhoto !== photo ? handleUploadPhoto() : orgialPhoto

      let submitData = {
        "id": route.params.item._id,
        "describe": values.describe,
        "category": category.value,
        "price": values.price,
        "remark": values.remark,
        "token": reduxToken,
        "imageUrl": target?.imageUrl,
      }
      const response = await service.postUploadProduct(submitData);
      await appCtx.setLoading(false);
      if (response?.status === 'success') navigation.goBack()
    }
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: route.params?.item.describe ? route.params.item.describe : '',
      price: route.params?.item.price ? route.params.item.price : '',
      remark: route.params?.item.remark ? route.params.item.remark : ''
    },
    validate: (values) => {
      const reg = /^\d+(\.\d{1,2})?$/
      const errors: PhotoItem = {};

      if (!values.describe) errors.describe = '*' + "字數必須少於12";
      if (values.price == 0) errors.price = '*' + "必須大於0";
      if (!reg.test(values.price)) errors.price = '*' + "必須數字且最多小數點後第2位";

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
    let submitData = await createFormData(photo)
    const response = await service.postUploadImage(submitData);
    if (response?.data) return response.data
  };

  const deleteItem = async (item: string) => {
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
          onPress: () => deleteCargo(item),
          style: "default",
        }
      ], {}
    );
  }

  const deleteCargo = async (item: string) => {
    let submitData = {
      "id": item,
    }
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') navigation.goBack()
  }


  const postProductFilter = async () => {
    // call api
    let submitData = {
      token: reduxToken
    }
    const response = await service.postProductFilter(submitData);
    if (!['', null, undefined].includes(response?.data)) setCategoryList(response.data)
  }

  React.useEffect(() => {
    if (isFocused) {
      postProductFilter()
      setCategory({
        label: route.params?.item.category ? route.params?.item.category : '',
        value: route.params?.item.category ? route.params?.item.category : '',
      })
    }
  }, [isFocused]);

  return (
    <UI.View style={styles.itemContainer}>
      <RN.TouchableOpacity onPress={handleChoosePhoto} style={{ borderWidth: 2, borderRadius: 10, overflow: 'hidden' }}>
        {photo ?
          <RN.View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <RN.Image
              source={{ uri: orgialPhoto !== photo ? photo?.uri : orgialPhoto }}
              style={{ width: windowWidth * 3 / 4, height: windowHeight / 3 }}
            />
          </RN.View>
          :
          <RN.View style={{ width: windowWidth * 3 / 4, height: windowHeight / 3, justifyContent: 'center', alignItems: 'center', backgroundColor: appCtx.Colors.inputContainer }}>
            <UI.Text style={{ fontSize: 20 }}>點擊新增圖片</UI.Text>
          </RN.View>
        }
      </RN.TouchableOpacity>
      <UI.View>
        <UI.Text style={styles.itemContainerText}>商品描述</UI.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          value={formik.values.describe}
          onChangeText={formik.handleChange("describe")}
          placeholder="描述"
        />
        {
          formik.errors.describe ? <UI.View>
            <UI.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.describe}
            </UI.Text>
          </UI.View>
            : <UI.View />
        }
      </UI.View>
      <UI.View>
        <UI.Text style={styles.itemContainerText}>商品分類</UI.Text>
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
      </UI.View>
      <UI.View>
        <UI.Text style={styles.itemContainerText}>商品價格</UI.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          value={formik.values.price}
          onChangeText={formik.handleChange("price")}
          placeholder="商品價格"
          keyboardType="phone-pad"
        />
        {
          formik.errors.price && <UI.View >
            <UI.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.price}
            </UI.Text>
          </UI.View>
        }
      </UI.View>
      <UI.View>
        <UI.Text style={styles.itemContainerText}>備註</UI.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          value={formik.values.remark}
          onChangeText={formik.handleChange("remark")}
          placeholder="備註"
        />
        {
          formik.errors.remark && <UI.View >
            <UI.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.remark}
            </UI.Text>
          </UI.View>
        }
      </UI.View>
      <UI.View style={styles.buttomGroup}>
        <UI.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
          <UI.Text style={[styles.saveContainerText]}>保存</UI.Text>
        </UI.TouchableOpacity>
        <UI.TouchableOpacity style={[styles.saveContainer]} onPress={() => deleteItem(route.params.item._id)}>
          <UI.Text style={styles.saveContainerText}>刪除</UI.Text>
        </UI.TouchableOpacity>
      </UI.View>
    </UI.View>
  )
};

const ProductItem = ({ route }: { route: any }) => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={() => Content(route)}></ScrollViewComponent>
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
  },
  input: {
    width: '100%',
    paddingLeft: 15,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  itemContainerText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10
  },
  saveContainer: {
    flex: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    marginTop: 20,
    margin: 10,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  saveContainerText: {
    textAlign: 'center',
  },
  picker: {
    paddingLeft: 15,
    height: 45,
    marginBottom: -20,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  buttomGroup: {
    flexDirection: 'row',
  }
});

export default ProductItem;