import { JSX, ReactNode } from 'react';
import { FileDialogProvider } from './FileDialog/FileDialogProvider';
import { MessageDialogProvider } from './MessageDialog/MessageDialogProvider';

export default function DialogProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <FileDialogProvider>
      <MessageDialogProvider>
        <>{children}</>
      </MessageDialogProvider>
    </FileDialogProvider>
  );
}
