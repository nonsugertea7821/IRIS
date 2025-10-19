import { useCallback, useState } from 'react';
import { ScreenerViewerForCSVInserterState } from '../ScreenerViewerForCSVInserter';

interface IScreenerViewerForCSVInserter {
  openWindow: () => void;
  state: ScreenerViewerForCSVInserterState;
}

export default function useScreenerViewerForCSVInserter(): IScreenerViewerForCSVInserter {
  const [isOpen, setIsOpen] = useState(false);
  const openWindow = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    openWindow,
    state: {
      isOpen,
      setIsOpen,
    },
  };
}
