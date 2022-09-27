import React from 'react';
// import { Layout } from 'antd';
import Header from './layout/header';
import Menus from './layout/menus';
import Content from './layout/content';

// const { Header, Content, Footer, Sider } = Layout;

const RootPage: React.FC = () => {
//   return (
//     <Layout>
//   <Header>header</Header>
//   <Layout>
//     <Sider>left sidebar</Sider>
//     <Content>main content</Content>
//     <Sider>right sidebar</Sider>
//   </Layout>
//   <Footer>footer</Footer>
// </Layout>
//   )
  return (
    <div>
      <Header />
      <div>
        <Menus />
        <Content />
      </div>
    </div>
  )
}

export default RootPage;
