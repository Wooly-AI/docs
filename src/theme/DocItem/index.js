/**
 * Swizzled to publish the current doc TOC into DocPageSidebarTOCContext for
 * the left sidebar (DocSidebarInlineTOC).
 */
import React, {useLayoutEffect} from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import {useDocPageSidebarTOC} from '@theme/DocPageSidebarTOCContext';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';

function DocItemSidebarTOCSync({content}) {
  const {setSidebarPageTOC} = useDocPageSidebarTOC();

  useLayoutEffect(() => {
    setSidebarPageTOC({
      docId: content.metadata.id,
      toc: content.toc,
      frontMatter: content.frontMatter,
    });
    return () => setSidebarPageTOC(null);
  }, [content, setSidebarPageTOC]);

  return null;
}

export default function DocItem(props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;

  return (
    <DocProvider content={props.content}>
      <DocItemSidebarTOCSync content={props.content} />
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <MDXComponent />
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
