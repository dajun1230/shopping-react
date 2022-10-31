import React from 'react';
import { Outlet } from 'react-router-dom';
import BreadCrumbPage from './bread-crumb';

const Content: React.FC = () => {
  return (
    <div className='pro-content-main'>
      <div className="main">
        <BreadCrumbPage />
        <Outlet />
      </div>
    </div>
  )
}

export default Content;
