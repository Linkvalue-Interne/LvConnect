// @flow

import * as React from 'react';
import { Helmet } from 'react-helmet';

type MetaProps = {
  title: string;
};

const Meta = ({ title }: MetaProps) => (process.env.APP_ENV === 'test' ? null : (
  <Helmet>
    <title>{title} | LVConnect</title>
  </Helmet>
));

export default Meta;
