import { useContext } from 'react';
import { MessageDialogContext } from './MessageDialogProvider';

export function useMessageDialog(): MessageDialogContext {
  const context = useContext(MessageDialogContext);
  if (!context) throw new Error('useMessageDialog must be used within a MessageDialogProvider');
  return context;
}
