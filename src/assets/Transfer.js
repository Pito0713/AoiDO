import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
export const Transfer = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={32}
    height={32}>
    <G
      stroke="#1C274C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}>
      <Path d="M20 10H4l5.5-6M4 14h16l-5.5 6" />
    </G>
  </Svg>
);
