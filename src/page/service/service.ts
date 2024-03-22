import axios from 'axios';
import getErrorMessage from '../../xhr/xhr'

const fetchApi = async (method: string, url: string) => {
  try {
    const response = await axios({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error: any) {
    let errorResult = getErrorMessage(error?.response?.status, error?.response?.data)
    console.log(`\x1B[41m\x1B[37m${errorResult.errorHTTP}\x1B[0m \x1B[31m${errorResult.errorText} `)
  }
};

const fetchApi_AuthParams = async (method: string, url: string, params: string) => {
  try {
    const response = await axios({
      method: method,
      url: url + params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error: any) {
    let errorResult = getErrorMessage(error?.response?.status, error?.response?.data)
    console.log(`\x1B[41m\x1B[37m${errorResult.errorHTTP}\x1B[0m \x1B[31m${errorResult.errorText} `)
  }
};

const fetchApi_AuthData = async (method: string, url: string, params: string | undefined, body: any) => {
  try {
    const response = await axios({
      method: method,
      url: url + params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
    });
    return response.data;
  } catch (error: any) {
    let errorResult = getErrorMessage(error?.response?.status, error?.response?.data)
    console.log(`\x1B[41m\x1B[37m${errorResult.errorHTTP}\x1B[0m \x1B[31m${errorResult.errorText} `)
  }
};

const fetchApi_upload_file = async (method: string, url: string, params: string | undefined, body: any) => {
  try {
    const response = await axios({
      method: method,
      url: url + params,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: body,
    });
    return response.data;
  } catch (error: any) {
    let errorResult = getErrorMessage(error?.response?.status, error?.response?.data)
    console.log(`\x1B[41m\x1B[37m${errorResult.errorHTTP}\x1B[0m \x1B[31m${errorResult.errorText} `)
  }
};

interface getExchange {
  currency: string,
}

interface Cargo {
  id?: string,
  describe?: string,
  singNumber?: string,
  startDate?: Date | string,
  endDate?: Date | string,
  remark?: string,
  token?: string | null | undefined,
}

interface register {
  account?: string,
  password?: string,
  token?: string | null | undefined,
}

interface Platform {
  id?: string,
  label?: string,
  rate?: number | string,
  token?: string | null | undefined,
}
interface Product {
  id?: string,
  describe?: string,
  price?: string,
  remark?: string,
  token?: string | null | undefined,
  imageUrl?: string,
}

interface Image {
  id?: string,
  _id?: string,
  img?: string,
  isActive?: Boolean,
}

interface Order {
  id?: string,
  searchText?: string,
  page?: Number,
  pagination?: Number,
}



const Service = {
  getExchange: async (submitData: getExchange) => {
    let data = await fetchApi_AuthParams(
      'GET',
      `https://api.coinbase.com/v2/exchange-rates?`,
      `currency=${submitData.currency}`
    );
    return data;
  },
  postAllCargos: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/allCargos`,
      '',
      submitData,
    );
    return data;
  },

  postAddCargo: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/addCargo`,
      '',
      submitData
    );
    return data;
  },

  patchUpdateCargo: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'PATCH',
      `http://localhost:8082/updateCargo/`,
      submitData.id,
      submitData
    );
    return data;
  },

  deleteCargo: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/delCargo/`,
      submitData.id,
      {},
    );
    return data;
  },

  postRegister: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/register`,
      '',
      submitData
    );
    return data;
  },
  postLogin: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/login`,
      '',
      submitData
    );
    return data;
  },
 // 取得平台匯率
  postPlatformRate: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/platformRate`,
      '',
      submitData,
    );
    return data;
  },

  postCreateModifyRate: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createModifyRate`,
      '',
      submitData
    );
    return data;
  },

  
  // 更新平台匯率
  postUpdateModifyRate: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/updateModifyRate`,
      '',
      submitData
    );
    return data;
  },

  deleteModifyRate: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteModifyRate`,
      '',
      submitData
    );
    return data;
  },

  postSearchCargo: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/searchCargo`,
      '',
      submitData
    );
    return data;
  },

  postHandPassWord: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/handPassWord`,
      '',
      submitData
    );
    return data;
  },
  // 搜尋全部商品
  postAllProduct: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/allProduct`,
      '',
      submitData
    );
    return data;
  },
  // 新增商品
  postAddProduct: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/addProduct`,
      '',
      submitData
    );
    return data;
  },
  // 更新商品
  postUploadProduct: async (submitData: Product) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/uploadProduct`,
      '',
      submitData
    );
    return data;
  },

  // // 刪除商品
  deleteProductOne: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteProductOne/`,
      submitData.id,
      {},
    );
    return data;
  },

  deleteProductCategory: async (submitData: Cargo) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteProductCategory`,
      '',
      submitData,
    );
    return data;
  },

  postUploadImage: async (submitData: FormData | undefined) => {
    let data = await fetchApi_upload_file(
      'POST',
      `http://localhost:8082/uploadImage`,
      '',
      submitData
    );
    return data;
  },

  // 更新網頁圖片
  postUploadWebImage: async (submitData:any) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/uploadWebImage`,
      '',
      submitData
    );
    return data;
  },

  // 搜尋分類
  postProductFilter: async () => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/productFilter`,
      '',
      {},
    );
    return data;
  },

  postCreateProductFilter: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createProductFilter`,
      '',
      submitData
    );
    return data;
  },

  deleteProductFilter: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteProductFilter`,
      '',
      submitData
    );
    return data;
  },

  // 新增優惠卷
  postCreateCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createCoupon`,
      '',
      submitData
    );
    return data;
  },
  postFindAllCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/findAllCoupon`,
      '',
      submitData
    );
    return data;
  },
  // 搜尋優惠卷
  postSearchCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/searchCoupon`,
      '',
      submitData
    );
    return data;
  },
  // 更新優惠卷
  patchUpdateCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'patch',
      `http://localhost:8082/updateCoupon/`,
      submitData.id,
      submitData,
    );
    return data;
  },
  patchUpdateCouponUser: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'patch',
      `http://localhost:8082/updateCouponUser/`,
      submitData.id,
      {},
    );
    return data;
  },
  deleteOneCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteOneCoupon/`,
      submitData.id,
      {},
    );
    return data;
  },
  deleteAllCoupon: async (submitData: Platform) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteAllCoupon`,
      submitData.id,
      {},
    );
    return data;
  },
  // 新增輪播圖照片
  postCreateCarouselImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createCarouselImg`,
      '',
      submitData,
    );
    return data;
  },
  // 取得輪播圖照片
  getFindAllCarouselImg: async () => {
    let data = await fetchApi_AuthData(
      'GET',
      `http://localhost:8082/findAllCarouselImg`,
      '',
      '',
    );
    return data;
  },
  // 更新輪播照片
  patchUploadCarouselImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'PATCH',
      `http://localhost:8082/uploadCarouselImg`,
      '',
      submitData
    );
    return data;
  },

  // 刪除輪播照片
  deleteOneCarouselImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteOneCarouselImg/`,
      submitData.id,
      '',
    );
    return data;
  },

  // 新增關於照片
  postCreateAboutImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createAboutImg`,
      '',
      submitData
    );
    return data;
  },
  // 取得關於照片
  getFindAllAboutImg: async () => {
    let data = await fetchApi_AuthData(
      'GET',
      `http://localhost:8082/findAllAboutImg`,
      '',
      '',
    );
    return data;
  },
  // 更新關於照片
  patchUploadAboutImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'PATCH',
      `http://localhost:8082/uploadAboutImg`,
      '',
      submitData
    );
    return data;
  },

  // 刪除關於照片
  deleteOneAboutImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteOneAboutImg/`,
      submitData.id,
      '',
    );
    return data;
  },

   // 新增大綱照片
  postCreateMainImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/createMainImg`,
      '',
      submitData
    );
    return data;
  },
      // 取得大綱照片
  getFindAllMainImg: async () => {
    let data = await fetchApi_AuthData(
      'GET',
      `http://localhost:8082/findAllMainImg`,
      '',
      '',
    );
    return data;
  },
  // 更新大綱照片
  patchUploadMainImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'PATCH',
      `http://localhost:8082/uploadMainImg`,
      '',
      submitData
    );
    return data;
  },

  // 刪除大綱照片
  deleteOneMainImg: async (submitData: Image) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteOneMainImg/`,
      submitData.id,
      '',
    );
    return data;
  },

  posUserBackRegister: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/userBackRegister`,
      '',
      submitData
    );
    return data;
  },
  postUserBackLogin: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/userBackLogin`,
      '',
      submitData
    );
    return data;
  },
  postUserBackhandPassWord: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/userBackhandPassWord`,
      '',
      submitData
    );
    return data;
  },
  getUserBackInfo: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'GET',
      `http://localhost:8082/userBackInfo`,
      '',
      submitData
    );
    return data;
  },

  getFindAllUserBack: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'POST',
      `http://localhost:8082/findAllUserBack`,
      '',
      submitData
    );
    return data;
  },

  patchUploadUserPermission: async (submitData: register) => {
    let data = await fetchApi_AuthData(
      'PATCH',
      `http://localhost:8082/uploadUserPermission`,
      '',
      submitData
    );
    return data;
  },
  // 搜尋訂單
  postSearchOrder: async (submitData: Order) => {
    let data = await fetchApi_AuthData(
      'post',
      `http://localhost:8082/searchOrder`,
      '',
      submitData
    );
    return data;
  },

  // 刪除訂單
  deleteOneOrder: async (submitData: Order) => {
    let data = await fetchApi_AuthData(
      'DELETE',
      `http://localhost:8082/deleteOneOrder/`,
      submitData.id,
      '',
    );
    return data;
  },

}

export default Service;
