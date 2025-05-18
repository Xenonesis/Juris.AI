import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useActiveSectionContext } from '@/app/about/context/active-section-context';

export function useSectionInView(sectionName: string, threshold = 0.75) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold });
  const { setActiveSection } = useActiveSectionContext();

  useEffect(() => {
    if (isInView) {
      setActiveSection(sectionName);
    }
  }, [isInView, setActiveSection, sectionName]);

  return {
    ref,
  };
}