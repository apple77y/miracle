'use client';

import ReactDOM from 'react-dom';

export default function ResourceHints() {
  ReactDOM.prefetchDNS('https://hangeul.pstatic.net');
  ReactDOM.preconnect('https://hangeul.pstatic.net', { crossOrigin: '' });
  ReactDOM.preload('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css', { as: 'style' });
  return null;
}
