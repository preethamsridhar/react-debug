import { useState, useEffect } from 'react';

// BUG: Scroll listener is added with a new inline function each time the effect runs.
// The cleanup removes using a different reference than was registered — leak.
// BUG: Reads element.scrollTop + applies box-shadow style synchronously in the
// scroll handler, forcing layout (read) then paint (write) on every scroll event
// with no throttle or requestAnimationFrame.
export function useScrollShadow(ref) {
  const [shadowed, setShadowed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('scroll', function onScroll() {
      const scrolled = el.scrollTop > 0;
      setShadowed(scrolled);
      // Forces synchronous style mutation inside scroll — causes layout thrashing
      el.style.boxShadow = scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none';
    });

    return () => el.removeEventListener('scroll', () => {});
  }, [ref]);

  return shadowed;
}
