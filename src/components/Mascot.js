import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Quadros do mascote tirados do protótipo (0-2: cabeça inclinada de olho fechado,
// 3-4: olhos fechados, 5-7: abrindo, 8-19: olhos abertos).
const FRAMES = [
  require('../../assets/mascote/m_00.jpg'),
  require('../../assets/mascote/m_01.jpg'),
  require('../../assets/mascote/m_02.jpg'),
  require('../../assets/mascote/m_03.jpg'),
  require('../../assets/mascote/m_04.jpg'),
  require('../../assets/mascote/m_05.jpg'),
  require('../../assets/mascote/m_06.jpg'),
  require('../../assets/mascote/m_07.jpg'),
  require('../../assets/mascote/m_08.jpg'),
  require('../../assets/mascote/m_09.jpg'),
  require('../../assets/mascote/m_10.jpg'),
  require('../../assets/mascote/m_11.jpg'),
  require('../../assets/mascote/m_12.jpg'),
  require('../../assets/mascote/m_13.jpg'),
  require('../../assets/mascote/m_14.jpg'),
  require('../../assets/mascote/m_15.jpg'),
  require('../../assets/mascote/m_16.jpg'),
  require('../../assets/mascote/m_17.jpg'),
  require('../../assets/mascote/m_18.jpg'),
  require('../../assets/mascote/m_19.jpg'),
];
const OPEN = FRAMES.length - 1;
export const MASCOT_OPEN = FRAMES[OPEN];

const INTRO = FRAMES.map((_, i) => i); // acorda: inclina a cabeça e abre os olhos
const BLINK = [6, 4, 3, 3, 4, 6, OPEN]; // piscada

export default function Mascot({ size = 88, animate = true }) {
  const [frame, setFrame] = useState(animate ? 0 : OPEN);

  useEffect(() => {
    if (!animate) return;
    let timer;
    let cancelled = false;
    const play = (seq, i, done) => {
      if (cancelled) return;
      if (i >= seq.length) return done();
      setFrame(seq[i]);
      timer = setTimeout(() => play(seq, i + 1, done), 70);
    };
    const loop = () => {
      timer = setTimeout(() => play(BLINK, 0, loop), 2500 + Math.random() * 2000);
    };
    play(INTRO, 0, loop);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [animate]);

  const box = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.clip, box]}>
      {/* Todos os quadros ficam carregados; só o atual aparece (evita piscar branco ao trocar). */}
      {FRAMES.map((src, i) => (
        <Image
          key={i}
          source={src}
          style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, opacity: i === frame ? 1 : 0 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden', backgroundColor: '#fff' },
});
