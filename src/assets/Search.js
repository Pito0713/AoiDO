import * as React from 'react';
import Svg, { G, Circle, Path } from 'react-native-svg';
export const Search = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={30}
    height={30}>
    <G
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}>
      <Circle cx={10} cy={10} r={6} />
      <Path d="M14.5 14.5 19 19" />
    </G>
  </Svg>
);
