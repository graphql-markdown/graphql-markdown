/**
 * @module mdx
 * This module provides MDX React components.
 */

import type { MDXString } from "@graphql-markdown/types";

/**
 * MDX helper components injected into generated documents so Docusaurus
 * can render badges, bullets, details, and SpecifiedBy links without
 * requiring manual component registration in every project.
 *
 * @packageDocumentation
 */

/**
 * String literal that declares the React helpers (`Bullet`, `SpecifiedBy`, etc.)
 * which GraphQL-Markdown prepends to every generated MDX file.
 */
export const mdxDeclaration: MDXString = `
export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em', color: 'var(--ifm-color-secondary-darkest)' }}>&nbsp;●&nbsp;</span></>

export const SpecifiedBy = (props) => <>Specification<a className="link" style={{ fontSize:'1.5em', paddingLeft:'4px' }} target="_blank" href={props.url} title={'Specified by ' + props.url}>⎘</a></>

export const Badge = (props) => <><span className={props.class}>{props.text}</span></>

import { useState } from 'react';
import ThemedDetails from '@theme/Details';

export const Details = ({ dataOpen, dataClose, children, startOpen = false }) => {
  const [open, setOpen] = useState(Boolean(startOpen));
  return (
    <ThemedDetails
      open={open}
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
      }}
      summary={open ? dataOpen : dataClose}
    >
      {children}
    </ThemedDetails>
  );
};


` as MDXString;
