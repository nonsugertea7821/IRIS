import { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import { useAxiosErrorHandler } from '../axios/handler/AxiosErrorHandler';

/**
 * Uncaught(in Promise)の解決を提供します。
 */
export default function usePromiseRejectionHandler() {
  const { handleAxiosError } = useAxiosErrorHandler();

  /**
   * 解決処理
   */
  const handleRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      if (event.reason && (event.reason as AxiosError).isAxiosError === true) {
        handleAxiosError(event.reason);
      }
    },
    [handleAxiosError]
  );

  // 解決処理を設定する
  useEffect(() => {
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [handleRejection]);
}
