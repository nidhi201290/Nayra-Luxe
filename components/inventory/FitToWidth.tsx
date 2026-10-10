"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

// Shows fixed-width content (like the 480px invoice image) scaled down to fit
// narrow screens. Only the on-screen preview shrinks: the content keeps its
// real size, so the downloaded invoice image is unaffected.
export default function FitToWidth({ width, children }: { width: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function update() {
      const available = outer.current?.clientWidth ?? width;
      const next = Math.min(1, available / width);
      setScale(next);
      setHeight((inner.current?.offsetHeight ?? 0) * next);
    }
    update();
    const ro = new ResizeObserver(update);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={outer}
      className="mx-auto w-full overflow-hidden"
      style={{ maxWidth: width, height }}
    >
      <div
        ref={inner}
        style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}
