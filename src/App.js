import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Routers from './routes/routes'
import { ToastContainer } from 'react-toastify';
const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const params = useLocation().pathname
  function switchPage(){
    let page = ''
    switch(params){
      case '/':
        page = '1'
        break
      case '/Product':
        page = '2'
        break
      case '/Manage':
        page = '3'
        break
      default:
        page = '1'
    }
    return page
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className='tw-bg-white'>
        <div className="logo tw-flex tw-justify-center tw-items-center " style={{
          height: '32px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.3)'
        }}>bakery shop</div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[switchPage()]}
          items={[
            {
              key: '1',
              icon: <Link to='/' />,
              label: 'Unit',
            },
            {
              key: '2',
              icon: <Link to='/Product' />,
              label: 'Product',
            },
            {
              key: '3',
              icon: <Link to='/Manage'/>,
              label: 'Manage',
            },
            {
              key: '4',
              icon: <Link to='/Type'/>,
              label: 'Type of product',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: '#fff'
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            style: {
              padding: '0 24px',
              fontSize: '18px',
              lineheight: '64px',
              cursor: 'pointer',
              transition: 'color 0.3s',
            },
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background tw-bg-[#fff]"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Routers />
        </Content>
      </Layout>
      <ToastContainer autoClose={5000}/>
    </Layout>
  );
};

export default App;