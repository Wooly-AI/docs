import React from 'react';
import {translate} from '@docusaurus/Translate';
import TOCItems from '@theme/TOCItems';
import {useDocPageSidebarTOC} from '@theme/DocPageSidebarTOCContext';

const linkClassName = 'table-of-contents__link toc-highlight';
const linkActiveClassName = 'table-of-contents__link--active';

/**
 * @param {{ anchorDocId?: string }} props
 * When `anchorDocId` is set, TOC only renders if it matches the current page
 * (so it can live under that doc's sidebar `<li>`).
 */
export default function DocSidebarInlineTOC({anchorDocId} = {}) {
  const {sidebarPageTOC} = useDocPageSidebarTOC();

  if (!sidebarPageTOC) {
    return null;
  }

  if (anchorDocId !== undefined && sidebarPageTOC.docId !== anchorDocId) {
    return null;
  }

  const {toc, frontMatter} = sidebarPageTOC;
  const hideTableOfContents = Boolean(frontMatter?.hide_table_of_contents);

  if (hideTableOfContents || !toc?.length) {
    return null;
  }

  return (
    <div
      className="doc-sidebar-inline-toc"
      role="navigation"
      aria-label={translate({
        id: 'theme.docs.sidebar.inlineTocAriaLabel',
        message: 'On this page',
        description: 'ARIA label for headings list shown under the active doc in the sidebar',
      })}>
      <TOCItems
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className="doc-sidebar-inline-toc__list"
        linkClassName={linkClassName}
        linkActiveClassName={linkActiveClassName}
      />
    </div>
  );
}
