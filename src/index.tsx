import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MobxText from './mobx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <MobxText />
);
