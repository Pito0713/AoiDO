import {AppRegistry} from 'react-native';
import App from './App';
// 注冊 App 組件為 "App"，以便在 Web 上運行
AppRegistry.registerComponent('AoiDO', () => App);
AppRegistry.runApplication('AoiDO', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
