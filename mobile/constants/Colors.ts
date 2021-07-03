const tintColorLight = '#fff';
const tintColorDark = '#fff';

const COLORS = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  silver: '#c0c0c0',
  salmon: '#fa8072',
  lightsalmon: '#ffa07a',
  darksalmon: '#e9967a',
  lightcoral: '#f08080',
  indianred: '#cd5c5c',
  crimson: '#dc143c',
  firebrick: '#b22222',
  red: '#ff0000',
  darkred: '#8b0000',
  maroon: '#800000',
  tomato: '#ff6347',
  orangered: '#ff4500',
  palevioletred: '#db7093',
};

export default {
  light: {
    text: '#000',
    background: '#ff6347',
    tint: tintColorLight,
    tabBackground: '#ff6347',
    tabTint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabBackground: '#000',
    tabTint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
