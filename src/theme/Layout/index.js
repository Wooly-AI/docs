/**
 * Swizzled so DocPageSidebarTOCProvider wraps Navbar + main. The mobile docs
 * sidebar renders inside Navbar (secondary menu) and is not under DocRootLayout,
 * so the TOC context must live here. See DocSidebarInlineTOC.
 */
import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useKeyboardNavigation} from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import {DocPageSidebarTOCProvider} from '@theme/DocPageSidebarTOCContext';
import styles from './styles.module.css';

export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    title,
    description,
  } = props;

  useKeyboardNavigation();

  return (
    <LayoutProvider>
      <DocPageSidebarTOCProvider>
        <PageMetadata title={title} description={description} />

        <SkipToContent />

        <AnnouncementBar />

        <Navbar />

        <div
          id={SkipToContentFallbackId}
          className={clsx(
            ThemeClassNames.layout.main.container,
            ThemeClassNames.wrapper.main,
            styles.mainWrapper,
            wrapperClassName,
          )}>
          <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
            {children}
          </ErrorBoundary>
        </div>

        {!noFooter && <Footer />}
      </DocPageSidebarTOCProvider>
    </LayoutProvider>
  );
}
