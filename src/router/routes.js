const unAuthedPages = [
  {
    name: 'sign',
    component: require('../page/Sign/index').default,
  },
  {
    name: 'register',
    component: require('../page/Register/index').default,
  },
];

const authedPages = [
  {
    name: 'main',
    component: require('../page/Main/index').default,
  },
  {
    name: 'transfer',
    component: require('../page/Transfer').default,
  },
  {
    name: 'setting',
    component: require('../page/Setting/index').default,
  },
  {
    name: 'coupon',
    component: require('../page/Coupon/index').default,
  },
  {
    name: 'platform',
    component: require('../page/Platform/index').default,
  },
  {
    name: 'product',
    component: require('../page/Product/index').default,
  },
  {
    name: 'order',
    component: require('../page/Order/index').default,
  },

  {
    name: 'OrderItem',
    component: require('../page/Order/orderItem').default,
  },

  {
    name: 'AddProductItem',
    component: require('../page/Product/AddProductItem').default,
  },
  {
    name: 'ProductItem',
    component: require('../page/Product/ProductItem').default,
  },
  {
    name: 'handPassWord',
    component: require('../page/HandPassWord/index').default,
  },
  {
    name: 'AddPlatformItem',
    component: require('../page/Platform/AddPlatformItem').default,
  },
  {
    name: 'productFilter',
    component: require('../page/ProductFilter/index').default,
  },
  {
    name: 'addProductFilterItem',
    component: require('../page/ProductFilter/AddProductFilterItem').default,
  },
  {
    name: 'productFilterItem',
    component: require('../page/ProductFilter/ProductFilterItem').default,
  },
  ////////////////////////
  {
    name: 'CouponItem',
    component: require('../page/Coupon/CouponItem').default,
  },

  {
    name: 'AddCouponItem',
    component: require('../page/Coupon/AddCouponItem').default,
  },

  {
    name: 'CarouselImg',
    component: require('../page/Image/carouselImg').default,
  },
  {
    name: 'AboutImg',
    component: require('../page/Image/aboutImg').default,
  },
  {
    name: 'MainImg',
    component: require('../page/Image/mainImg').default,
  },
  {
    name: 'Permission',
    component: require('../page/Permission/index').default,
  },
];

export {unAuthedPages, authedPages};
