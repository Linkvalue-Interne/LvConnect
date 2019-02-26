// @flow

import React from 'react';
import diacritics from 'diacritics';

const replacementMap = new Map(diacritics.replacementList.map(({ base, chars }) => [base, chars]));

type HighlightProps = {
  search?: string;
  text?: string;
}

const Highlight = ({ search, text }: HighlightProps) => {
  if (!search || !text) {
    return text;
  }
  const searchRegexp = new RegExp(
    diacritics.remove(search)
      .trim()
      .replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
      .replace(/\w/g, match => `[${match}${replacementMap.get(match) || ''}]`)
      .split(/\s/g)
      .filter(s => s)
      .join('|'),
    'ig',
  );
  return <span dangerouslySetInnerHTML={{ __html: text.replace(searchRegexp, match => `<b>${match}</b>`) }} />;
};

Highlight.defaultProps = {
  search: '',
  text: '',
};

export default Highlight;
