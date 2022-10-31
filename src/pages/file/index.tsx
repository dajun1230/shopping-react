import React from 'react';
import { Outlet } from 'react-router-dom';

function FileManage() {
  return (
    <div>
      文件管理
      <Outlet />
    </div>
  )
}

export default FileManage;
