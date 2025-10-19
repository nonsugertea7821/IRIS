/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMessageDialog } from '@/parts/Dialog/MessageDialog/useMessageDialog';
import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AxiosErrorの共通ハンドリング処理インターフェース
 */
export interface AxiosErrorHandler {
  /**
   * AxiosError共通ハンドリング処理
   * @param error AxiosError
   * @returns
   */
  handleAxiosError: (error: AxiosError<unknown, any>) => void;
}

/**
 * AxiosErrorの共通ハンドリング処理を提供します。
 * @returns {@link AxiosErrorHandler}
 */
export function useAxiosErrorHandler(): AxiosErrorHandler {
  // メッセージダイアログ
  const { openMessageDialog } = useMessageDialog();
  // ナビゲーター
  const navigate = useNavigate();

  const navigateToLoginPage = useCallback(() => {
    navigate('/');
  }, [navigate]);

  /**
   * AxiosError共通ハンドリング処理
   * @param error AxiosError
   * @returns
   */
  const handleAxiosError = React.useCallback(
    (error: AxiosError) => {
      if (error.status === 401) {
        openMessageDialog('認証に失敗しました。', navigateToLoginPage, '警告');
      }
    },
    [navigateToLoginPage, openMessageDialog]
  );

  return {
    handleAxiosError,
  };
}
