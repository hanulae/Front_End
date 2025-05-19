import Svg, {G, Path} from 'react-native-svg';

const MoveIcon = ({color, stroke}: {color?: string; stroke?: string}) => {
  return (
    <Svg width="17" height="16" viewBox="0 0 17 16" fill={'none'}>
      <G opacity="0.5">
        <Path
          d="M9.64868 14.4311L16.0835 8.00005L9.64868 1.56897"
          stroke={stroke || '#FFFFFF'}
          stroke-width="1.25"
          stroke-linecap="round"
        />
        <Path
          d="M0.91626 7.375C0.571082 7.375 0.29126 7.65482 0.29126 8C0.29126 8.34518 0.571082 8.625 0.91626 8.625V7.375ZM16.0183 7.375H0.91626V8.625H16.0183V7.375Z"
          fill={color || '#FFFFFF'}
        />
      </G>
    </Svg>
  );
};

export default MoveIcon;
