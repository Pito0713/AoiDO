const unAuthedPages = [
  {
    name: "sign",
    component: require('../page/Sign/index').default,
  },
  {
    name: "register",
    component: require('../page/Register/index').default,
  },
];

const authedPages = [
  {
    name: "main",
    component: require('../page/Main/index').default,
  },
  {
    name: "transfer",
    component: require('../page/Transfer').default,
  },
  {
    name: "setting",
    component: require('../page/Setting/index').default,
  },
  {
    name: "logistics",
    component: require('../page/Logistics/index').default,
  },
  {
    name: "platform",
    component: require('../page/Platform/index').default,
  },
  {
    name: "product",
    component: require('../page/Product/index').default,
  },
  {
    name: "AddProductItem",
    component: require('../page/Product/AddProductItem').default,
  },
  {
    name: "ProductItem",
    component: require('../page/Product/ProductItem').default,
  },
  {
    name: "handPassWord",
    component: require('../page/HandPassWord/index').default,
  },
  {
    name: "AddPlatformItem",
    component: require('../page/Platform/AddPlatformItem').default,
  },
  {
    name: "productFilter",
    component: require('../page/ProductFilter/index').default,
  },
  {
    name: "addProductFilterItem",
    component: require('../page/ProductFilter/AddProductFilterItem').default,
  },
  {
    name: "productFilterItem",
    component: require('../page/ProductFilter/ProductFilterItem').default,
  },
  //////////////////////// 
  {
    name: "LogisticsItem",
    component: require('../page/Logistics/LogisticsItem').default,
  },

  {
    name: "AddLogisticsItem",
    component: require('../page/Logistics/AddLogisticsItem').default,
  },

];

export {
  unAuthedPages,
  authedPages,
};
