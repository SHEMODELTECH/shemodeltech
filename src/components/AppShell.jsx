// src/components/AppShell.jsx - Wraps legacy pages inside the AppLayout sidebar
// This suppresses the old Navbar by providing context, and wraps children in the sidebar layout
import React, { createContext, useContext } from 'react';
import AppLayout from './AppLayout';

export const AppShellContext = createContext(false);
export const useInAppShell = () => useContext(AppShellContext);

const AppShell = ({ children }) => {
  return (
    <AppShellContext.Provider value={true}>
      <AppLayout>
        {children}
      </AppLayout>
    </AppShellContext.Provider>
  );
};

export default AppShell;
