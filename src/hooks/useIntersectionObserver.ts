import { useEffect, useState } from "react";

const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options = {
    threshold: 0,
    root: null,
    rootMargin: "0px",
  }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
};

export default useIntersectionObserver;
