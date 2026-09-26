import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[70] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #C9A227, #F5D76E, #C9A227)',
        boxShadow: '0 0 10px rgba(201,162,39,0.5)',
      }}
    />
  );
}
