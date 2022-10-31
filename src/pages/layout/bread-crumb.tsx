import React from 'react';
import { Breadcrumb } from 'antd';

const BreadCrumbPage = () => {
  return (
    <div className='main-bread'>
      <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        <Breadcrumb.Item>用户列表</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default BreadCrumbPage;
