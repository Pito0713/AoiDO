import React from 'react';
import * as RN from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
import ScrollViewComponent from '../../component/ScrollViewComponent';

import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback'
import ReminderText from '../../component/ReminderText';
import Plus from '../../assets/Plus';
import Checkbg from '../../assets/Checkbg';

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
    // launchImageLibrary({ mediaType: 'photo' }, (response: any) => {
    //   let target: Photo = {}
    //   if (!['', null, undefined].includes(response?.assets)) {
    //     target = response?.assets[0]
    //     if (['image/jpg', 'image/jpeg', 'image/png'].includes(target.type as string)) {
    //       setPhoto(target)
    //     } else RN.Alert.alert('不支援圖片格式')
    //   }
    // });
  };


  const handleUploadPhoto = async () => {
    let submitData = createFormData(photo)
    const response = await service.postUploadImage(submitData);
    if (response?.data) return response.data
  };

  const postCreateCarouselImg = async () => {
    let target = await handleUploadPhoto()
    await appCtx.setLoading(true);

    if(target) {
      let submitData = {
        img: target?.imageUrl,
        isActive: false
      }

      if(submitData.img) {
        const response = await service.postCreateAboutImg(submitData);
        if (response?.status === 'success') {
          getFindAllAboutImg()
        }
      }
    }
    await appCtx.setLoading(false);
  };

  const getFindAllAboutImg = async () => {
    await appCtx.setLoading(true);

    const response = await service.getFindAllAboutImg();

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
          onPress: () => deleteOneAboutImg(item),
          style: 'default',
        },
      ],
      {},
    );
  };

  const deleteOneAboutImg = async (item:string | undefined) => {
    let submitData = {
      id: item,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteOneAboutImg(submitData);
    if (response?.status === 'success') getFindAllAboutImg();
    await appCtx.setLoading(false);
  };

  const patchUploadAboutImg = async (item: submitData) => {
    let submitData = {
      id: item.id,
      isActive: !item.isActive
    };
    await appCtx.setLoading(true);
    const response = await service.patchUploadAboutImg(submitData);
    if (response?.status === 'success') getFindAllAboutImg();
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    getFindAllAboutImg();
  }, []);

  return (
    <RN.View style={styles.container}>
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
            <Plus
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
                // onLongPress={() => deleteItem(item._id)}
                // onPress={() => patchUploadAboutImg(item)}
                key={index}>
                <RN.ImageBackground
                  source={{uri: `${item.img}`}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="cover">
                  { item.isActive ? <Checkbg
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

const AboutImg = () => {
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

export default AboutImg;
