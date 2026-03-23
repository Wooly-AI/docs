/**
 * Swizzled to render the current page TOC inside this `<li>`, under the active
 * doc link (see DocSidebarInlineTOC + DocPageSidebarTOCContext).
 */
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import DocSidebarInlineTOC from '@theme/DocSidebarInlineTOC';
import styles from './styles.module.css';

function LinkLabel({label}) {
  return (
    <span title={label} className={styles.linkLabel}>
      {label}
    </span>
  );
}

/**
 * Client sidebar props normalize doc/ref entries to `type: 'link'` plus `docId`
 * (see plugin-content-docs `toSidebarDocItemLinkProp`). Plain external links have
 * no `docId`.
 *
 * @param {{ type: string; id?: string; docId?: string }} item
 */
function getSidebarItemDocId(item) {
  if (item.type === 'link' && typeof item.docId === 'string') {
    return item.docId;
  }
  if (item.type === 'doc' || item.type === 'ref') {
    return item.id;
  }
  return undefined;
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const sidebarDocId = getSidebarItemDocId(item);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <LinkLabel label={label} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
      {isActive && sidebarDocId ? (
        <DocSidebarInlineTOC anchorDocId={sidebarDocId} />
      ) : null}
    </li>
  );
}
