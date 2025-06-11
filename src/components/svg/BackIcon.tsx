import Svg, {Path} from 'react-native-svg';

interface IBackIconProps {
  color?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const BackIcon = ({color, fill, width, height}: IBackIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 20" fill={fill}>
      <Path
        d="M8.12112 2.28571L0.848389 10.2893L8.12112 17.7143"
        stroke={color}
        stroke-linecap="round"
      />
      <Path
        d="M1.78784 10.2893H18.1515"
        stroke={color}
        stroke-linecap="round"
      />
    </Svg>
  );
};
