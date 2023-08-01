import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 117 117"
    width={24}
    height={24}>
    <G fill="none" fillRule="nonzero">
      <Path
        fill="#4A4A4A"
        d="M58.5 116.6c32 0 58.1-26 58.1-58.1S90.5.4 58.5.4.4 26.5.4 58.5s26.1 58.1 58.1 58.1Zm0-108c27.5 0 49.9 22.4 49.9 49.9S86 108.4 58.5 108.4 8.6 86 8.6 58.5 31 8.6 58.5 8.6Z"
      />
      <Path
        fill="#17AB13"
        d="M36.7 79.7c.8.8 1.8 1.2 2.9 1.2 1.1 0 2.1-.4 2.9-1.2l16-16 16 16c.8.8 1.8 1.2 2.9 1.2 1.1 0 2.1-.4 2.9-1.2 1.6-1.6 1.6-4.2 0-5.8l-16-16 16-16c1.6-1.6 1.6-4.2 0-5.8-1.6-1.6-4.2-1.6-5.8 0l-16 16-16-16c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l16 16-16 16c-1.6 1.6-1.6 4.2 0 5.8Z"
      />
    </G>
  </Svg>
);
export default SvgComponent;
