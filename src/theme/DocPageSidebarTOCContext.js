import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * @typedef {{
 *   docId: string;
 *   toc: import('@docusaurus/types').TOCItem[];
 *   frontMatter: Record<string, unknown>;
 * } | null} SidebarPageTOCState
 */

const DocPageSidebarTOCContext = createContext(
  /** @type {{ sidebarPageTOC: SidebarPageTOCState; setSidebarPageTOC: (v: SidebarPageTOCState) => void } | null} */ (
    null
  ),
);

export function DocPageSidebarTOCProvider({children}) {
  const [sidebarPageTOC, setSidebarPageTOCState] =
    /** @type {import('react').useState<SidebarPageTOCState>} */ (useState)(
      null,
    );

  const setSidebarPageTOC = useCallback((value) => {
    setSidebarPageTOCState(value);
  }, []);

  const value = useMemo(
    () => ({sidebarPageTOC, setSidebarPageTOC}),
    [sidebarPageTOC, setSidebarPageTOC],
  );

  return (
    <DocPageSidebarTOCContext.Provider value={value}>
      {children}
    </DocPageSidebarTOCContext.Provider>
  );
}

export function useDocPageSidebarTOC() {
  const context = useContext(DocPageSidebarTOCContext);
  if (context === null) {
    throw new Error(
      'useDocPageSidebarTOC must be used within DocPageSidebarTOCProvider',
    );
  }
  return context;
}
