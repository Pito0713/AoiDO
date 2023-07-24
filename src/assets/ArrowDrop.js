import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 48 48"
    width={30}
    height={30}>
    <Path fill="#fff" fillOpacity={0.01} d="M0 0h48v48H0z" />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M37 18 25 30 13 18"
    />
  </Svg>
);
export default SvgComponent;
