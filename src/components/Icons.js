import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { colors } from '../theme';

const C = colors.navy;

export function PawIcon({ size = 40, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* 4 dedinhos em arco */}
      <Ellipse cx="11.5" cy="29" rx="5.6" ry="7" fill={color} transform="rotate(-28 11.5 29)" />
      <Ellipse cx="23.5" cy="16.5" rx="6.2" ry="8" fill={color} transform="rotate(-10 23.5 16.5)" />
      <Ellipse cx="40.5" cy="16.5" rx="6.2" ry="8" fill={color} transform="rotate(10 40.5 16.5)" />
      <Ellipse cx="52.5" cy="29" rx="5.6" ry="7" fill={color} transform="rotate(28 52.5 29)" />
      {/* almofada principal */}
      <Path
        d="M32 31c-5.2 0-8.6 3.6-11.4 8.2-2.6 4.2-6.6 6.9-6.6 11.6 0 4.6 3.6 7.7 8.2 7.7 3.9 0 6.6-1.9 9.8-1.9s5.9 1.9 9.8 1.9c4.6 0 8.2-3.1 8.2-7.7 0-4.7-4-7.4-6.6-11.6C40.6 34.6 37.2 31 32 31z"
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

export function PencilIcon({ size = 20, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M13.5 6.5l4 4" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraIcon({ size = 20, color = C }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3l1.5-2.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="2" />
    </Svg>
  );
}
