import { createContext, JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import MessageDialog, { MessageDialogButtons, MessageDialogHeader } from './MessageDialog';

export interface MessageDialogContext {
  openMessageDialog: (
    message: string,
    onOk?: () => void,
    header?: MessageDialogHeader,
    buttons?: MessageDialogButtons
  ) => void;
}

export const MessageDialogContext = createContext<MessageDialogContext | undefined>(undefined);

export function MessageDialogProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onOkCallback, setOnOkCallback] = useState<(() => void) | null>(null);
  const [header, setHeader] = useState<MessageDialogHeader>('確認');
  const [buttons, setButtons] = useState<MessageDialogButtons>('ok');

  const openMessageDialog = useCallback(
    (message: string, onOk?: () => void, header?: MessageDialogHeader, buttons?: MessageDialogButtons) => {
      setHeader(header ?? '確認');
      setMessage(message);
      setOnOkCallback(() => onOk || null);
      setButtons(buttons ?? 'ok');
      setIsOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setMessage('');
    setOnOkCallback(null);
    setButtons('ok');
  }, []);

  const handleOk = useCallback(() => {
    if (onOkCallback) onOkCallback();
    handleClose();
  }, [onOkCallback, handleClose]);

  const context = useMemo<MessageDialogContext>(() => ({ openMessageDialog }), [openMessageDialog]);

  return (
    <MessageDialogContext.Provider value={context}>
      {children}
      <MessageDialog
        isOpen={isOpen}
        onClose={handleClose}
        message={message}
        onOk={handleOk}
        header={header}
        buttons={buttons}
      />
    </MessageDialogContext.Provider>
  );
}
