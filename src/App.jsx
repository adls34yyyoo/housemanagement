import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, List, Card, Avatar, Badge, Input, Select, DatePicker, Modal, Form, message } from 'antd';
import { 
  HomeOutlined, 
  ApartmentOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabase = createClient(
  'https://lbnvuzsxvjwwqqzxkzgo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibnZ1enN4dmp3d3FxeHpremdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3ODQ1NDQsImV4cCI6MjA3MjM2MDU0NH0.uU1U7I2zQq9B6aRjW8GkP0k2vX1x2X4Z1aZ1bZ1cZ1d'
);

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  // 登录处理
  const handleLogin = async () => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      message.success('登录成功');
    } else {
      message.error('用户名或密码错误');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    message.success('登出成功');
  };

  // 获取房源数据
  useEffect(() => {
    if (isLoggedIn) {
      fetchProperties();
    }
  }, [isLoggedIn]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      
      if (error) {
        console.error('获取房源数据失败:', error);
        message.error('获取房源数据失败');
      } else {
        setProperties(data || []);
        setFilteredProperties(data || []);
      }
    } catch (error) {
      console.error('获取房源数据异常:', error);
      message.error('获取房源数据异常');
    }
  };

  // 搜索房源
  useEffect(() => {
    if (searchText) {
      const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(searchText.toLowerCase()) ||
        property.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchText, properties]);

  // 添加房源
  const handleAddProperty = async (values) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: values.title,
          address: values.address,
          price: values.price,
          type: values.type,
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          description: values.description,
          status: values.status
        })
        .select();
      
      if (error) {
        console.error('添加房源失败:', error);
        message.error('添加房源失败');
      } else {
        message.success('添加房源成功');
        setDrawerVisible(false);
        form.resetFields();
        fetchProperties();
      }
    } catch (error) {
      console.error('添加房源异常:', error);
      message.error('添加房源异常');
    }
  };

  // 更新房源
  const handleUpdateProperty = async (values) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          title: values.title,
          address: values.address,
          price: values.price,
          type: values.type,
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          description: values.description,
          status: values.status
        })
        .eq('id', selectedProperty.id)
        .select();
      
      if (error) {
        console.error('更新房源失败:', error);
        message.error('更新房源失败');
      } else {
        message.success('更新房源成功');
        setIsModalVisible(false);
        form.resetFields();
        fetchProperties();
      }
    } catch (error) {
      console.error('更新房源异常:', error);
      message.error('更新房源异常');
    }
  };

  // 删除房源
  const handleDeleteProperty = async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('删除房源失败:', error);
        message.error('删除房源失败');
      } else {
        message.success('删除房源成功');
        fetchProperties();
      }
    } catch (error) {
      console.error('删除房源异常:', error);
      message.error('删除房源异常');
    }
  };

  // 打开编辑模态框
  const openEditModal = (property) => {
    setSelectedProperty(property);
    form.setFieldsValue(property);
    setIsModalVisible(true);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Card
            title="房源管理系统登录"
            style={{ width: 400, padding: 24, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          >
            <Form
              layout="vertical"
              onFinish={handleLogin}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  prefix={<UserOutlined />}
                  placeholder="请输入密码"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  style={{ width: '100%', height: 40, fontSize: 16 }}
                >
                  登录
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <p>默认用户名: admin</p>
                <p>默认密码: admin123</p>
              </div>
            </Form>
          </Card>
        </div>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            breakpoint="md"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              if (broken) {
                setMobileMenuVisible(false);
              }
            }}
          >
            <div className="logo" style={{ 
              height: 64, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 18, 
              fontWeight: 'bold',
              color: '#fff'
            }}>
              房源管理系统
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <HomeOutlined />,
                  label: '首页',
                  path: '/'
                },
                {
                  key: '2',
                  icon: <ApartmentOutlined />,
                  label: '房源管理',
                  path: '/properties'
                },
                {
                  key: '3',
                  icon: <UserOutlined />,
                  label: '个人中心',
                  path: '/profile'
                },
                {
                  key: '4',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: handleLogout
                }
              ].filter(item => item.path ? true : true)}
              onClick={({ key, item }) => {
                if (item.props.path) {
                  window.location.href = item.props.path;
                }
              }}
            />
          </Sider>
          <Layout>
            <Header style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0 24px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
                style={{ display: 'none', fontSize: 18 }}
                className="mobile-menu-button"
              />
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>房源管理系统</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>欢迎, {username}</span>
                <Button 
                  type="default" 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  退出登录
                </Button>
              </div>
            </Header>
            <Content style={{ 
              margin: '24px 16px', 
              padding: 24, 
              background: '#fff', 
              minHeight: 280,
              borderRadius: 8
            }}>
              <Routes>
                <Route path="/" element={
                  <div>
                    <h2 style={{ marginBottom: 24 }}>系统概览</h2>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: 16,
                      marginBottom: 24
                    }}>
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                          {properties.length}
                        </div>
                        <div style={{ color: '#666' }}>总房源数</div>
                      </Card>
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                          {properties.filter(p => p.status === 'available').length}
                        </div>
                        <div style={{ color: '#666' }}>可租房源</div>
                      </Card>
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
                          {properties.filter(p => p.status === 'rented').length}
                        </div>
                        <div style={{ color: '#666' }}>已租房源</div>
                      </Card>
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                          {properties.filter(p => p.status === 'maintenance').length}
                        </div>
                        <div style={{ color: '#666' }}>维护中房源</div>
                      </Card>
                    </div>
                    <h3 style={{ marginBottom: 16 }}>最近房源</h3>
                    <List
                      itemLayout="horizontal"
                      dataSource={properties.slice(0, 5)}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button 
                              key="edit" 
                              type="text" 
                              icon={<EditOutlined />}
                              onClick={() => openEditModal(item)}
                            >
                              编辑
                            </Button>,
                            <Button 
                              key="delete" 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteProperty(item.id)}
                            >
                              删除
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.title.charAt(0)}</Avatar>}
                            title={
                              <div>
                                <span>{item.title}</span>
                                <Badge 
                                  status={
                                    item.status === 'available' ? 'success' :
                                    item.status === 'rented' ? 'processing' : 'warning'
                                  } 
                                  text={
                                    item.status === 'available' ? '可租' :
                                    item.status === 'rented' ? '已租' : '维护中'
                                  } 
                                  style={{ marginLeft: 8 }}
                                />
                              </div>
                            }
                            description={
                              <div>
                                <p>{item.address}</p>
                                <p>¥{item.price}/月 | {item.area}㎡ | {item.bedrooms}室{item.bathrooms}卫</p>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                } />
                <Route path="/properties" element={
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 24
                    }}>
                      <h2>房源管理</h2>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerVisible(true)}
                      >
                        添加房源
                      </Button>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                      <Input
                        placeholder="搜索房源..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                      />
                    </div>
                    <List
                      grid={{ 
                        gutter: 16, 
                        xs: 1, 
                        sm: 2, 
                        md: 3, 
                        lg: 4, 
                        xl: 4,
                        xxl: 5,
                      }}
                      dataSource={filteredProperties}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            hoverable
                            cover={
                              <div style={{ 
                                height: 150, 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 24,
                                fontWeight: 'bold'
                              }}>
                                {item.title.charAt(0)}
                              </div>
                            }
                            actions={[
                              <Button 
                                key="edit" 
                                type="text" 
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(item)}
                              >
                                编辑
                              </Button>,
                              <Button 
                                key="delete" 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteProperty(item.id)}
                              >
                                删除
                              </Button>
                            ]}
                          >
                            <Card.Meta
                              title={
                                <div>
                                  <span>{item.title}</span>
                                  <Badge 
                                    status={
                                      item.status === 'available' ? 'success' :
                                      item.status === 'rented' ? 'processing' : 'warning'
                                    } 
                                    text={
                                      item.status === 'available' ? '可租' :
                                      item.status === 'rented' ? '已租' : '维护中'
                                    } 
                                    style={{ marginLeft: 8 }}
                                  />
                                </div>
                              }
                              description={
                                <div>
                                  <p>{item.address}</p>
                                  <p>¥{item.price}/月</p>
                                  <p>{item.area}㎡ | {item.bedrooms}室{item.bathrooms}卫</p>
                                  <p>{item.type}</p>
                                </div>
                              }
                            />
                          </Card>
                        </List.Item>
                      )}
                    />
                  </div>
                } />
                <Route path="/profile" element={
                  <div>
                    <h2>个人中心</h2>
                    <Card style={{ marginTop: 16 }}>
                      <p>用户名: {username}</p>
                      <p>角色: 管理员</p>
                      <p>系统版本: 1.0.0</p>
                    </Card>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Content>
          </Layout>

          {/* 移动端菜单抽屉 */}
          <Drawer
            title="菜单"
            placement="left"
            onClose={() => setMobileMenuVisible(false)}
            open={mobileMenuVisible}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <HomeOutlined />,
                  label: '首页',
                  onClick: () => {
                    window.location.href = '/';
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '2',
                  icon: <ApartmentOutlined />,
                  label: '房源管理',
                  onClick: () => {
                    window.location.href = '/properties';
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '3',
                  icon: <UserOutlined />,
                  label: '个人中心',
                  onClick: () => {
                    window.location.href = '/profile';
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '4',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: () => {
                    handleLogout();
                    setMobileMenuVisible(false);
                  }
                }
              ]}
            />
          </Drawer>

          {/* 添加房源抽屉 */}
          <Drawer
            title="添加房源"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={500}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddProperty}
            >
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入房源标题' }]}
              >
                <Input placeholder="请输入房源标题" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入房源地址' }]}
              >
                <Input placeholder="请输入房源地址" />
              </Form.Item>
              <Form.Item
                label="价格"
                name="price"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <Input type="number" placeholder="请输入价格" />
              </Form.Item>
              <Form.Item
                label="房源类型"
                name="type"
                rules={[{ required: true, message: '请选择房源类型' }]}
              >
                <Select placeholder="请选择房源类型">
                  <Option value="公寓">公寓</Option>
                  <Option value="别墅">别墅</Option>
                  <Option value="普通住宅">普通住宅</Option>
                  <Option value="商住两用">商住两用</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="面积"
                name="area"
                rules={[{ required: true, message: '请输入面积' }]}
              >
                <Input type="number" placeholder="请输入面积" />
              </Form.Item>
              <Form.Item
                label="卧室数量"
                name="bedrooms"
                rules={[{ required: true, message: '请输入卧室数量' }]}
              >
                <Input type="number" placeholder="请输入卧室数量" />
              </Form.Item>
              <Form.Item
                label="卫生间数量"
                name="bathrooms"
                rules={[{ required: true, message: '请输入卫生间数量' }]}
              >
                <Input type="number" placeholder="请输入卫生间数量" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="available">可租</Option>
                  <Option value="rented">已租</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
              >
                <Input.TextArea placeholder="请输入房源描述" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setDrawerVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Drawer>

          {/* 编辑房源模态框 */}
          <Modal
            title="编辑房源"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProperty}
            >
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入房源标题' }]}
              >
                <Input placeholder="请输入房源标题" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入房源地址' }]}
              >
                <Input placeholder="请输入房源地址" />
              </Form.Item>
              <Form.Item
                label="价格"
                name="price"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <Input type="number" placeholder="请输入价格" />
              </Form.Item>
              <Form.Item
                label="房源类型"
                name="type"
                rules={[{ required: true, message: '请选择房源类型' }]}
              >
                <Select placeholder="请选择房源类型">
                  <Option value="公寓">公寓</Option>
                  <Option value="别墅">别墅</Option>
                  <Option value="普通住宅">普通住宅</Option>
                  <Option value="商住两用">商住两用</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="面积"
                name="area"
                rules={[{ required: true, message: '请输入面积' }]}
              >
                <Input type="number" placeholder="请输入面积" />
              </Form.Item>
              <Form.Item
                label="卧室数量"
                name="bedrooms"
                rules={[{ required: true, message: '请输入卧室数量' }]}
              >
                <Input type="number" placeholder="请输入卧室数量" />
              </Form.Item>
              <Form.Item
                label="卫生间数量"
                name="bathrooms"
                rules={[{ required: true, message: '请输入卫生间数量' }]}
              >
                <Input type="number" placeholder="请输入卫生间数量" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="available">可租</Option>
                  <Option value="rented">已租</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
              >
                <Input.TextArea placeholder="请输入房源描述" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      )}
    </Router>
  );
}

export default App;