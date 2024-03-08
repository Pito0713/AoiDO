import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
export const Plus = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={30}
    height={30}>
    <G stroke="#323232" strokeWidth={2}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
      <Path d="M3 12c0-7.412 1.588-9 9-9s9 1.588 9 9-1.588 9-9 9-9-1.588-9-9Z" />
    </G>
  </Svg>
);