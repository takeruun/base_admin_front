import { MutableRefObject } from 'react';

export type textHtmlProps = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  htmlRef: MutableRefObject<any>;
  initialHtml?: string;
};
