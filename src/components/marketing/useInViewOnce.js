import { useEffect, useRef, useState } from 'react';

export function useInViewOnce(options = { root: null, rootMargin: '0px', threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);

    io.observe(node);
    return () => io.disconnect();
  }, [inView, options]);

  return { ref, inView };
}

