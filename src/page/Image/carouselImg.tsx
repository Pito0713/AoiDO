import React from 'react';
import * as RN from 'react-native';
import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import SvgUri from 'react-native-svg-uri';
import Goback from '../../component/Goback'
import { launchImageLibrary } from 'react-native-image-picker';
import ReminderText from '../../component/ReminderText';
import ScrollViewComponent from '../../component/ScrollViewComponent';

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Content = () => {
  const appCtx = React.useContext(AppContext);
  interface Photo {
    fileName?: string,
    fileSize?: number,
    height?: number,
    type?: string,
    uri?: string
    width?: number
  }

  interface submitData {
    id?: string,
    _id?: string | undefined,
    img?: string,
    isActive?: boolean,
  }

  const [photoList, setPhotoList] = React.useState([]);
  const [photo, setPhoto] = React.useState<Photo>({});

  const createFormData = (photo: Photo) => {
    if (['image/jpg', 'image/jpeg', 'image/png'].includes(photo?.type as string)) {
      const data = new FormData();

      data.append('file', {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
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
    const response = await service.postUploadImage(submitData);
    if (response?.data) return response.data
  };

  const postCreateCarouselImg = async () => {
    await appCtx.setLoading(true);
    let target = await handleUploadPhoto()

    if (target) {
    let submitData = {
      img: target.imageUrl,
      isActive: false
    }

    const response = await service.postCreateCarouselImg(submitData);

    if (response?.status === 'success') {
      getfindAllCarouselImg()
    }

  }
  await appCtx.setLoading(false);
  };

  const getfindAllCarouselImg = async () => {
    await appCtx.setLoading(true);

    const response = await service.getFindAllCarouselImg();

    if (response?.status === 'success') {
      setPhotoList(response.data);
      setPhoto({})
    }
    await appCtx.setLoading(false);
  };

  const deleteItem = (item: string | undefined)=> {
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
          onPress: () => deleteOneCarouselImg(item),
          style: 'default',
        },
      ],
      {},
    );
  };

  const deleteOneCarouselImg = async (item:string | undefined) => {
    let submitData = {
      id: item,
    };
    const response = await service.deleteOneCarouselImg(submitData);
    if (response?.status === 'success') getfindAllCarouselImg();
  };

  const patchUploadCarouselImg = async (item: submitData) => {
    let submitData = {
      id: item.id,
      isActive: !item.isActive
    };
    const response = await service.patchUploadCarouselImg(submitData);
    if (response?.status === 'success') getfindAllCarouselImg();
  };

  React.useEffect(() => {
    getfindAllCarouselImg();
  }, []);

  return (
    <RN.View>
      <RN.View style={[styles.addContainer ,{backgroundColor: appCtx.Colors.photo.cardBottom}]}>
        <RN.TouchableOpacity style={[{alignItems: 'center', justifyContent: 'center'}]} onPress={postCreateCarouselImg}>
          <RN.Text>上傳</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      {photo?.uri ?
        <RN.View style={[
          styles.addContent,
        ]}>
          <RN.Image
            source={{ uri: photo?.uri }}
            style={{ width: '100%', height: '100%' }}
          />
        </RN.View>
        :
        <RN.TouchableOpacity onPress={handleChoosePhoto}>
          <RN.View
          style={[
            styles.addContent,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
            <SvgUri
              width="30"
              height="30"
              source={require('../../assets/plus.svg')}
            />
          </RN.View>
        </RN.TouchableOpacity>
      }
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 長按圖片可刪除'} />
        <ReminderText text={'* 點擊圖片可啟用或取消'} />
      </RN.View>
      <RN.View style={styles.photoContainer}>
        {photoList.length > 0 ? (
          photoList.map((item:submitData, index) => {
            return (
              <RN.View
                style={[
                  styles.itemContainer,
                  {backgroundColor: appCtx.Colors.photo.cardContianer},
                ]}
                onLongPress={() => deleteItem(item._id)}
                onPress={() => patchUploadCarouselImg(item)}
                key={index}>
                <RN.ImageBackground
                  source={{uri: `${item.img}`}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover">
                  { item.isActive ? <SvgUri
                    width="25"
                    height="25"
                    source={require('../../assets/check_bg.svg')}
                  />: <RN.View /> }
                </RN.ImageBackground>
              </RN.View>
            );
          })
        ) : (
          <RN.View style={styles.itemContainer}>
            <RN.View
              style={[
                {
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  height: '100%',
                },
              ]}>
              <RN.Text style={{fontSize: 20}}>暫無資料</RN.Text>
            </RN.View>
          </RN.View>
        )}
      </RN.View>
    </RN.View>
  );
};


const CarouselImg = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={Content}></ScrollViewComponent>
    </RN.SafeAreaView>
  );
};


const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  itemContainer: {
    height: windowHeight / 4,
    width: windowWidth / 2 - 15,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    borderRadius: 15,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  addContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 50,
    width: 80,
    marginLeft: 10,
    marginBottom: 10,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  addContent: {
    height: windowHeight / 4,
    width: windowWidth / 2 - 15,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    borderRadius: 15,
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

export default CarouselImg;