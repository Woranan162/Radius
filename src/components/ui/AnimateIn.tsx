"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Variant = "fade-up" | "fade-in" | "scale-in" | "slide-right";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  as?: ElementType;
  style?: CSSProperties;
};

const hiddenClass: Record<Variant, string> = {
  "fade-up": "motion-hidden-up",
  "fade-in": "motion-hidden-fade",
  "scale-in": "motion-hidden-scale",
  "slide-right": "motion-hidden-right",
};

const visibleClass: Record<Variant, string> = {
  "fade-up": "motion-visible-up",
  "fade-in": "motion-visible-fade",
  "scale-in": "motion-visible-scale",
  "slide-right": "motion-visible-right",
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
  as: Tag = "div",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${visible ? visibleClass[variant] : hiddenClass[variant]} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
