import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // تعطيل على الجوال
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('a, button, [role="button"], input, textarea, select'));
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* الحلقة الخارجية */}
      <div
        className="fixed pointer-events-none z-[999] rounded-full transition-transform duration-200 ease-smooth"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 50 : 32,
          height: hovering ? 50 : 32,
          transform: 'translate(-50%, -50%)',
          border: '2px solid rgba(201, 162, 39, 0.6)',
          boxShadow: '0 0 15px rgba(201, 162, 39, 0.4)',
        }}
      />
      {/* النقطة الداخلية */}
      <div
        className="fixed pointer-events-none z-[999] rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          width: 6,
          height: 6,
          transform: 'translate(-50%, -50%)',
          background: '#F5D76E',
          boxShadow: '0 0 10px rgba(245, 215, 110, 0.8)',
        }}
      />
    </>
  );
}
