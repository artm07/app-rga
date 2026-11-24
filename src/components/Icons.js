import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { colors } from '../theme';

const C = colors.navy;

export function PawIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Ellipse cx="18" cy="16" rx="6.5" ry="8.5" fill={color} transform="rotate(-12 18 16)" />
      <Ellipse cx="46" cy="16" rx="6.5" ry="8.5" fill={color} transform="rotate(12 46 16)" />
      <Ellipse cx="7" cy="31" rx="5.5" ry="7.5" fill={color} transform="rotate(-25 7 31)" />
      <Ellipse cx="57" cy="31" rx="5.5" ry="7.5" fill={color} transform="rotate(25 57 31)" />
      <Path
        d="M32 28c-7 0-11 7-15 12-4 4.5-6 8-4 12 2.5 4.5 8 3 12 2.2 2.5-.5 4.5-.8 7-.8s4.5.3 7 .8c4 .8 9.5 2.3 12-2.2 2-4 0-7.5-4-12-4-5-8-12-15-12z"
        fill={color}
      />
    </Svg>
  );
}

export function ClipboardIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="12" y="10" width="40" height="50" rx="4" stroke={color} strokeWidth="3.5" />
      <Rect x="23" y="5" width="18" height="10" rx="3" stroke={color} strokeWidth="3.5" fill={colors.white} />
      {[24, 35, 46].map((y) => (
        <Path key={y} d={`M18 ${y}l3 3 5-6`} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {[25, 36, 47].map((y) => (
        <Path key={y} d={`M31 ${y}h15`} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      ))}
    </Svg>
  );
}

export function AlertIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M27 8a5 5 0 0 1 10 0l-1.8 32a3.2 3.2 0 0 1-6.4 0z" fill={color} />
      <Circle cx="32" cy="53" r="5.5" fill={color} />
    </Svg>
  );
}

export function LockIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M19 30V21a13 13 0 0 1 26 0v9" stroke={color} strokeWidth="5" />
      <Rect x="12" y="29" width="40" height="30" rx="3" fill={color} />
    </Svg>
  );
}

export function HeartIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M32 57C18 46 5 36 5 22 5 13 12 6 20.5 6 25.5 6 29.5 8.5 32 12.5 34.5 8.5 38.5 6 43.5 6 52 6 59 13 59 22c0 14-13 24-27 35z"
        fill={color}
      />
    </Svg>
  );
}

export function MenuIcon({ size = 22, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {[6, 12, 18].map((y) => (
        <Rect key={y} x="2" y={y - 1.2} width="20" height="2.4" rx="1.2" fill={color} />
      ))}
    </Svg>
  );
}

export function BackIcon({ size = 22, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 4l-8 8 8 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SyringeIcon({ size = 22, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 2l4 4M20 4l-3 3M15 5l4 4M17 7L8 16l-3-3 9-9M8 16l-2 2M5 13l-1 1 3 3M3 21l3-3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PinIcon({ size = 22, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" fill={color} />
      <Circle cx="12" cy="9" r="2.6" fill={colors.white} />
    </Svg>
  );
}
