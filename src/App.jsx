import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  MenuOutlined,
  TeamOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  DeleteRowOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

// 本地存储工具函数
const storage = {
  get: (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};

// 初始化默认数据
const defaultProperties = [
  {
    id: 1,
    title: '阳光公寓',
    address: '北京市朝阳区',
    price: 5000,
    type: '公寓',
    area: 80,
    bedrooms: 2,
    bathrooms: 1,
    description: '交通便利，配套齐全',
    status: 'available',
    community_id: 1
  },
  {
    id: 2,
    title: '豪华别墅',
    address: '上海市浦东新区',
    price: 15000,
    type: '别墅',
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    description: '带花园，私密性好',
    status: 'rented',
    community_id: 2
  }
];

const defaultCommunities = [
  {
    id: 1,
    name: '阳光小区',
    address: '北京市朝阳区',
    description: '环境优美，配套齐全',
    property_count: 50
  },
  {
    id: 2,
    name: '豪华别墅区',
    address: '上海市浦东新区',
    description: '高端社区，私密性好',
    property_count: 20
  }
];

const defaultCustomers = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    address: '北京市朝阳区',
    需求: '两居室，交通便利',
    status: 'active'
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    address: '上海市浦东新区',
    需求: '三居室，带车位',
    status: 'inactive'
  }
];

const defaultRecycled = [
  {
    id: 1,
    title: '旧公寓',
    address: '北京市海淀区',
    price: 4000,
    type: '公寓',
    area: 60,
    bedrooms: 1,
    bathrooms: 1,
    description: '老旧小区，需要装修',
    deleted_at: '2026-03-20'
  }
];

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

// AI功能相关函数
const aiFunctions = {
  generateTitle: (type) => {
    const typeText = type === 'sell' ? '出售' : '出租';
    const titles = [
      `精装修${typeText} - 拎包入住`,
      `${typeText}房源 - 交通便利`,
      `优质${typeText} - 采光好`,
      `${typeText}好房 - 配套齐全`,
      `温馨${typeText} - 环境优美`
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  },
  generateAddress: () => {
    const addresses = [
      '北京市朝阳区建国路88号',
      '上海市浦东新区陆家嘴金融中心',
      '广州市天河区珠江新城',
      '深圳市南山区科技园',
      '杭州市西湖区西溪湿地附近'
    ];
    return addresses[Math.floor(Math.random() * addresses.length)];
  },
  generateCommunity: () => {
    const communities = [
      '阳光小区',
      '幸福家园',
      '绿地花园',
      '金色家园',
      '和谐社区'
    ];
    return communities[Math.floor(Math.random() * communities.length)];
  },
  generateDescription: (type) => {
    const typeText = type === 'sell' ? '出售' : '出租';
    const descriptions = [
      `该房源位于繁华地段，交通便利，周边配套齐全，适合${typeText}。房屋采光好，通风佳，是理想的居住选择。`,
      `精装修${typeText}房源，拎包即可入住，小区环境优美，绿化率高，安静舒适。`,
      `此房源交通便利，周边有学校、商场、医院等配套设施，生活便利，是${typeText}的绝佳选择。`,
      `房屋格局方正，采光充足，通风良好，周边环境优美，适合${typeText}。`,
      `该${typeText}房源位于成熟小区，配套齐全，交通便利，是您理想的居住场所。`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
};

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [recycledProperties, setRecycledProperties] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [communityDrawerVisible, setCommunityDrawerVisible] = useState(false);
  const [customerDrawerVisible, setCustomerDrawerVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [communityForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [communitySearchText, setCommunitySearchText] = useState('');
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [propertyType, setPropertyType] = useState('rent');
  const [isListening, setIsListening] = useState(false);

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
      fetchCommunities();
      fetchCustomers();
      fetchRecycledProperties();
    }
  }, [isLoggedIn]);

  // 搜索小区
  useEffect(() => {
    if (communitySearchText) {
      const filtered = communities.filter(community => 
        community.name.toLowerCase().includes(communitySearchText.toLowerCase()) ||
        community.address.toLowerCase().includes(communitySearchText.toLowerCase())
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities);
    }
  }, [communitySearchText, communities]);

  // 搜索客户
  useEffect(() => {
    if (customerSearchText) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearchText.toLowerCase()) ||
        customer.phone.toLowerCase().includes(customerSearchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearchText.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchText, customers]);

  const fetchProperties = () => {
    const data = storage.get('properties', defaultProperties);
    setProperties(data);
    setFilteredProperties(data);
  };

  // 获取小区数据
  const fetchCommunities = () => {
    const data = storage.get('communities', defaultCommunities);
    setCommunities(data);
    setFilteredCommunities(data);
  };

  // 获取回收站数据
  const fetchRecycledProperties = () => {
    const data = storage.get('recycledProperties', defaultRecycled);
    setRecycledProperties(data);
  };

  // 添加小区
  const handleAddCommunity = (values) => {
    const newCommunity = {
      id: Date.now(),
      name: values.name,
      address: values.address,
      description: values.description,
      property_count: values.property_count || 0
    };
    const updated = [...communities, newCommunity];
    storage.set('communities', updated);
    setCommunities(updated);
    setFilteredCommunities(updated);
    message.success('添加小区成功');
    setCommunityDrawerVisible(false);
    communityForm.resetFields();
  };

  // 更新小区
  const handleUpdateCommunity = (values) => {
    const updated = communities.map(c => 
      c.id === selectedCommunity.id 
        ? { ...c, ...values }
        : c
    );
    storage.set('communities', updated);
    setCommunities(updated);
    setFilteredCommunities(updated);
    message.success('更新小区成功');
    setCommunityModalVisible(false);
    communityForm.resetFields();
  };

  // 删除小区
  const handleDeleteCommunity = (id) => {
    const updated = communities.filter(c => c.id !== id);
    storage.set('communities', updated);
    setCommunities(updated);
    setFilteredCommunities(updated);
    message.success('删除小区成功');
  };

  // 打开编辑小区模态框
  const openEditCommunityModal = (community) => {
    setSelectedCommunity(community);
    communityForm.setFieldsValue(community);
    setCommunityModalVisible(true);
  };

  // 一键发布朋友圈
  const handleShareToMoments = (property) => {
    const shareText = `【${property.title}】\n地址: ${property.address}\n价格: ¥${property.price}/月\n面积: ${property.area}㎡\n户型: ${property.bedrooms}室${property.bathrooms}卫\n状态: ${property.status === 'available' ? '可租' : property.status === 'rented' ? '已租' : '维护中'}\n描述: ${property.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: shareText,
        url: window.location.href
      }).then(() => {
        message.success('分享成功');
      }).catch((error) => {
        console.error('分享失败:', error);
        message.error('分享失败');
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(shareText).then(() => {
        message.success('分享内容已复制到剪贴板');
      }).catch((error) => {
        console.error('复制失败:', error);
        message.error('复制失败');
      });
    }
  };

  // 恢复回收站中的房源
  const handleRestoreProperty = (id) => {
    const item = recycledProperties.find(r => r.id === id);
    if (item) {
      const updatedRecycled = recycledProperties.filter(r => r.id !== id);
      const restoredProperty = { ...item };
      delete restoredProperty.deleted_at;
      const updatedProperties = [...properties, restoredProperty];
      
      storage.set('recycledProperties', updatedRecycled);
      storage.set('properties', updatedProperties);
      
      setRecycledProperties(updatedRecycled);
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      
      message.success('恢复房源成功');
    }
  };

  // 永久删除回收站中的房源
  const handlePermanentDeleteProperty = (id) => {
    const updated = recycledProperties.filter(r => r.id !== id);
    storage.set('recycledProperties', updated);
    setRecycledProperties(updated);
    message.success('永久删除房源成功');
  };

  // 获取客户数据
  const fetchCustomers = () => {
    const data = storage.get('customers', defaultCustomers);
    setCustomers(data);
    setFilteredCustomers(data);
  };

  // 添加客户
  const handleAddCustomer = (values) => {
    const newCustomer = {
      id: Date.now(),
      ...values
    };
    const updated = [...customers, newCustomer];
    storage.set('customers', updated);
    setCustomers(updated);
    setFilteredCustomers(updated);
    message.success('添加客户成功');
    setCustomerDrawerVisible(false);
    customerForm.resetFields();
  };

  // 更新客户
  const handleUpdateCustomer = (values) => {
    const updated = customers.map(c => 
      c.id === selectedCustomer.id 
        ? { ...c, ...values }
        : c
    );
    storage.set('customers', updated);
    setCustomers(updated);
    setFilteredCustomers(updated);
    message.success('更新客户成功');
    setCustomerModalVisible(false);
    customerForm.resetFields();
  };

  // 删除客户
  const handleDeleteCustomer = (id) => {
    const updated = customers.filter(c => c.id !== id);
    storage.set('customers', updated);
    setCustomers(updated);
    setFilteredCustomers(updated);
    message.success('删除客户成功');
  };

  // 打开编辑客户模态框
  const openEditCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    customerForm.setFieldsValue(customer);
    setCustomerModalVisible(true);
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
  const handleAddProperty = (values) => {
    const newProperty = {
      id: Date.now(),
      ...values,
      propertyType: propertyType,
      status: values.status || (propertyType === 'rent' ? '可租' : '在售')
    };
    const updated = [...properties, newProperty];
    storage.set('properties', updated);
    setProperties(updated);
    setFilteredProperties(updated);
    message.success('添加房源成功');
    setDrawerVisible(false);
    form.resetFields();
  };

  // 更新房源
  const handleUpdateProperty = (values) => {
    const updated = properties.map(p => 
      p.id === selectedProperty.id 
        ? { ...p, ...values }
        : p
    );
    storage.set('properties', updated);
    setProperties(updated);
    setFilteredProperties(updated);
    message.success('更新房源成功');
    setIsModalVisible(false);
    form.resetFields();
  };

  // 删除房源（移至回收站）
  const handleDeleteProperty = (id) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      // 添加到回收站
      const recycledItem = {
        ...property,
        deleted_at: new Date().toISOString().split('T')[0]
      };
      const updatedRecycled = [...recycledProperties, recycledItem];
      storage.set('recycledProperties', updatedRecycled);
      setRecycledProperties(updatedRecycled);
      
      // 从房源列表移除
      const updated = properties.filter(p => p.id !== id);
      storage.set('properties', updated);
      setProperties(updated);
      setFilteredProperties(updated);
      
      message.success('删除成功，已移至回收站');
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
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
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
                  style={{ 
                    width: '100%', 
                    height: 40, 
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                    border: 'none'
                  }}
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
            style={{
              background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)'
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
                  icon: <TeamOutlined />,
                  label: '小区管理',
                  path: '/communities'
                },
                {
                  key: '4',
                  icon: <CustomerServiceOutlined />,
                  label: '客户管理',
                  path: '/customers'
                },
                {
                  key: '5',
                  icon: <BarChartOutlined />,
                  label: '数据统计',
                  path: '/statistics'
                },
                {
                  key: '6',
                  icon: <DeleteRowOutlined />,
                  label: '回收站',
                  path: '/recycle'
                },
                {
                  key: '7',
                  icon: <UserOutlined />,
                  label: '个人中心',
                  path: '/profile'
                },
                {
                  key: '8',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: handleLogout
                }
              ].filter(item => item.path ? true : true)}
              onClick={({ key, item }) => {
                if (item.props.path) {
                  navigate(item.props.path);
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
              background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#fff'
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
              background: '#f0f8ff', 
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
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                          {communities.length}
                        </div>
                        <div style={{ color: '#666' }}>小区数量</div>
                      </Card>
                      <Card>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#13c2c2' }}>
                          {recycledProperties.length}
                        </div>
                        <div style={{ color: '#666' }}>回收站房源</div>
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
                              key="share" 
                              type="text" 
                              icon={<ShareAltOutlined />}
                              onClick={() => handleShareToMoments(item)}
                            >
                              分享
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
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setPropertyType('rent');
                            setDrawerVisible(true);
                          }}
                        >
                          新增租房
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setPropertyType('sell');
                            setDrawerVisible(true);
                          }}
                        >
                          新增卖房
                        </Button>
                      </div>
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
                                background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
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
                                key="share" 
                                type="text" 
                                icon={<ShareAltOutlined />}
                                onClick={() => handleShareToMoments(item)}
                              >
                                分享
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
                                    status={item.propertyType === 'sell' ? 'success' : 'processing'} 
                                    text={item.propertyType === 'sell' ? '卖房' : '租房'} 
                                    style={{ marginLeft: 8 }}
                                  />
                                </div>
                              }
                              description={
                                <div>
                                  <p>{item.address}</p>
                                  {item.community && <p>小区: {item.community}</p>}
                                  <p>¥{item.price}{item.propertyType === 'sell' ? '' : '/月'}</p>
                                  <p>{item.area}㎡ | {item.bedrooms}室{item.bathrooms}卫</p>
                                  <p>{item.type || '普通住宅'}</p>
                                  <p>状态: {item.status || '可租'}</p>
                                </div>
                              }
                            />
                          </Card>
                        </List.Item>
                      )}
                    />
                  </div>
                } />
                <Route path="/communities" element={
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 24
                    }}>
                      <h2>小区管理</h2>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setCommunityDrawerVisible(true)}
                      >
                        添加小区
                      </Button>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                      <Input
                        placeholder="搜索小区..."
                        prefix={<SearchOutlined />}
                        value={communitySearchText}
                        onChange={(e) => setCommunitySearchText(e.target.value)}
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
                      }}
                      dataSource={filteredCommunities}
                      renderItem={community => (
                        <List.Item>
                          <Card
                            hoverable
                            actions={[
                              <Button 
                                key="edit" 
                                type="text" 
                                icon={<EditOutlined />}
                                onClick={() => openEditCommunityModal(community)}
                              >
                                编辑
                              </Button>,
                              <Button 
                                key="delete" 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteCommunity(community.id)}
                              >
                                删除
                              </Button>
                            ]}
                          >
                            <Card.Meta
                              title={community.name}
                              description={
                                <div>
                                  <p>{community.address}</p>
                                  <p>房源数量: {community.property_count}</p>
                                  <p>{community.description}</p>
                                </div>
                              }
                            />
                          </Card>
                        </List.Item>
                      )}
                    />
                  </div>
                } />
                <Route path="/customers" element={
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 24
                    }}>
                      <h2>客户管理</h2>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setCustomerDrawerVisible(true)}
                      >
                        添加客户
                      </Button>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                      <Input
                        placeholder="搜索客户..."
                        prefix={<SearchOutlined />}
                        value={customerSearchText}
                        onChange={(e) => setCustomerSearchText(e.target.value)}
                        style={{ width: 300 }}
                      />
                    </div>
                    <List
                      itemLayout="horizontal"
                      dataSource={filteredCustomers}
                      renderItem={customer => (
                        <List.Item
                          actions={[
                            <Button 
                              key="edit" 
                              type="text" 
                              icon={<EditOutlined />}
                              onClick={() => openEditCustomerModal(customer)}
                            >
                              编辑
                            </Button>,
                            <Button 
                              key="delete" 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              删除
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{customer.name.charAt(0)}</Avatar>}
                            title={
                              <div>
                                <span>{customer.name}</span>
                                <Badge 
                                  status={customer.status === 'active' ? 'success' : 'default'} 
                                  text={customer.status === 'active' ? '活跃' : '非活跃'} 
                                  style={{ marginLeft: 8 }}
                                />
                              </div>
                            }
                            description={
                              <div>
                                <p>电话: {customer.phone}</p>
                                <p>邮箱: {customer.email}</p>
                                <p>地址: {customer.address}</p>
                                <p>需求: {customer.需求}</p>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                } />
                <Route path="/statistics" element={
                  <div>
                    <h2>数据统计</h2>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: 24,
                      marginBottom: 32
                    }}>
                      <Card>
                        <h3 style={{ marginBottom: 16 }}>房源状态分布</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>可租房源</span>
                            <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                              {properties.filter(p => p.status === 'available').length} ({Math.round((properties.filter(p => p.status === 'available').length / properties.length) * 100)}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>已租房源</span>
                            <span style={{ fontWeight: 'bold', color: '#fa8c16' }}>
                              {properties.filter(p => p.status === 'rented').length} ({Math.round((properties.filter(p => p.status === 'rented').length / properties.length) * 100)}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>维护中房源</span>
                            <span style={{ fontWeight: 'bold', color: '#f5222d' }}>
                              {properties.filter(p => p.status === 'maintenance').length} ({Math.round((properties.filter(p => p.status === 'maintenance').length / properties.length) * 100)}%)
                            </span>
                          </div>
                        </div>
                      </Card>
                      <Card>
                        <h3 style={{ marginBottom: 16 }}>房源类型分布</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {['公寓', '别墅', '普通住宅', '商住两用'].map(type => (
                            <div key={type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{type}</span>
                              <span style={{ fontWeight: 'bold' }}>
                                {properties.filter(p => p.type === type).length}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <Card>
                        <h3 style={{ marginBottom: 16 }}>小区房源数量</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {communities.map(community => (
                            <div key={community.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{community.name}</span>
                              <span style={{ fontWeight: 'bold' }}>
                                {community.property_count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <Card>
                        <h3 style={{ marginBottom: 16 }}>价格区间分布</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>5000元以下</span>
                            <span style={{ fontWeight: 'bold' }}>
                              {properties.filter(p => p.price < 5000).length}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>5000-10000元</span>
                            <span style={{ fontWeight: 'bold' }}>
                              {properties.filter(p => p.price >= 5000 && p.price < 10000).length}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>10000元以上</span>
                            <span style={{ fontWeight: 'bold' }}>
                              {properties.filter(p => p.price >= 10000).length}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                } />
                <Route path="/recycle" element={
                  <div>
                    <h2>回收站</h2>
                    <div style={{ marginBottom: 24 }}>
                      <p>回收站中共有 {recycledProperties.length} 个房源</p>
                    </div>
                    <List
                      itemLayout="horizontal"
                      dataSource={recycledProperties}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button 
                              key="restore" 
                              type="text" 
                              icon={<EditOutlined />}
                              onClick={() => handleRestoreProperty(item.id)}
                            >
                              恢复
                            </Button>,
                            <Button 
                              key="delete" 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => handlePermanentDeleteProperty(item.id)}
                            >
                              永久删除
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#f5222d' }}>{item.title.charAt(0)}</Avatar>}
                            title={item.title}
                            description={
                              <div>
                                <p>{item.address}</p>
                                <p>¥{item.price}/月 | {item.area}㎡ | {item.bedrooms}室{item.bathrooms}卫</p>
                                <p>删除时间: {item.deleted_at}</p>
                              </div>
                            }
                          />
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
                    navigate('/');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '2',
                  icon: <ApartmentOutlined />,
                  label: '房源管理',
                  onClick: () => {
                    navigate('/properties');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '3',
                  icon: <TeamOutlined />,
                  label: '小区管理',
                  onClick: () => {
                    navigate('/communities');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '4',
                  icon: <CustomerServiceOutlined />,
                  label: '客户管理',
                  onClick: () => {
                    navigate('/customers');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '5',
                  icon: <BarChartOutlined />,
                  label: '数据统计',
                  onClick: () => {
                    navigate('/statistics');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '6',
                  icon: <DeleteRowOutlined />,
                  label: '回收站',
                  onClick: () => {
                    navigate('/recycle');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '7',
                  icon: <UserOutlined />,
                  label: '个人中心',
                  onClick: () => {
                    navigate('/profile');
                    setMobileMenuVisible(false);
                  }
                },
                {
                  key: '8',
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
            title={propertyType === 'sell' ? '新增卖房' : '新增租房'}
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
                <div style={{ position: 'relative' }}>
                  <Input placeholder="请输入房源标题" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => {
                        const title = aiFunctions.generateTitle(propertyType);
                        form.setFieldsValue({ title });
                        message.success('AI生成标题成功');
                      }}
                    >
                      AI生成
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        if ('webkitSpeechRecognition' in window) {
                          const recognition = new webkitSpeechRecognition();
                          recognition.lang = 'zh-CN';
                          setIsListening(true);
                          recognition.onresult = function(event) {
                            const transcript = event.results[0][0].transcript;
                            form.setFieldsValue({ title: transcript });
                            setIsListening(false);
                            message.success('语音输入成功');
                          };
                          recognition.onerror = function() {
                            setIsListening(false);
                            message.error('语音输入失败');
                          };
                          recognition.start();
                          message.info('请开始说话...');
                        } else {
                          message.error('您的浏览器不支持语音输入');
                        }
                      }}
                    >
                      {isListening ? '正在聆听...' : '语音输入'}
                    </Button>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入房源地址' }]}
              >
                <div style={{ position: 'relative' }}>
                  <Input placeholder="请输入房源地址" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => {
                        const address = aiFunctions.generateAddress();
                        form.setFieldsValue({ address });
                        message.success('AI识别地址成功');
                      }}
                    >
                      AI识别
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        if ('webkitSpeechRecognition' in window) {
                          const recognition = new webkitSpeechRecognition();
                          recognition.lang = 'zh-CN';
                          setIsListening(true);
                          recognition.onresult = function(event) {
                            const transcript = event.results[0][0].transcript;
                            form.setFieldsValue({ address: transcript });
                            setIsListening(false);
                            message.success('语音输入成功');
                          };
                          recognition.onerror = function() {
                            setIsListening(false);
                            message.error('语音输入失败');
                          };
                          recognition.start();
                          message.info('请开始说话...');
                        } else {
                          message.error('您的浏览器不支持语音输入');
                        }
                      }}
                    >
                      {isListening ? '正在聆听...' : '语音输入'}
                    </Button>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label="小区"
                name="community"
              >
                <div style={{ position: 'relative' }}>
                  <Input placeholder="请输入小区名称（可自由添加）" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => {
                        const community = aiFunctions.generateCommunity();
                        form.setFieldsValue({ community });
                        message.success('AI推荐小区成功');
                      }}
                    >
                      AI推荐
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        if ('webkitSpeechRecognition' in window) {
                          const recognition = new webkitSpeechRecognition();
                          recognition.lang = 'zh-CN';
                          setIsListening(true);
                          recognition.onresult = function(event) {
                            const transcript = event.results[0][0].transcript;
                            form.setFieldsValue({ community: transcript });
                            setIsListening(false);
                            message.success('语音输入成功');
                          };
                          recognition.onerror = function() {
                            setIsListening(false);
                            message.error('语音输入失败');
                          };
                          recognition.start();
                          message.info('请开始说话...');
                        } else {
                          message.error('您的浏览器不支持语音输入');
                        }
                      }}
                    >
                      {isListening ? '正在聆听...' : '语音输入'}
                    </Button>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label={propertyType === 'sell' ? "价格（元）" : "价格（元/月）"}
                name="price"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <Input type="number" placeholder="请输入价格" />
              </Form.Item>
              <Form.Item
                label="类型"
                name="type"
              >
                <Input placeholder="请输入房源类型（如：公寓、别墅等）" />
              </Form.Item>
              <Form.Item
                label="面积（㎡）"
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
              >
                <Input placeholder="请输入状态（如：可租、已租、维护中等）" />
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
              >
                <div style={{ position: 'relative' }}>
                  <Input.TextArea placeholder="请输入房源描述" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => {
                        const description = aiFunctions.generateDescription(propertyType);
                        form.setFieldsValue({ description });
                        message.success('AI生成描述成功');
                      }}
                    >
                      AI生成
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        if ('webkitSpeechRecognition' in window) {
                          const recognition = new webkitSpeechRecognition();
                          recognition.lang = 'zh-CN';
                          setIsListening(true);
                          recognition.onresult = function(event) {
                            const transcript = event.results[0][0].transcript;
                            form.setFieldsValue({ description: transcript });
                            setIsListening(false);
                            message.success('语音输入成功');
                          };
                          recognition.onerror = function() {
                            setIsListening(false);
                            message.error('语音输入失败');
                          };
                          recognition.start();
                          message.info('请开始说话...');
                        } else {
                          message.error('您的浏览器不支持语音输入');
                        }
                      }}
                    >
                      {isListening ? '正在聆听...' : '语音输入'}
                    </Button>
                  </div>
                </div>
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

          {/* 添加小区抽屉 */}
          <Drawer
            title="添加小区"
            placement="right"
            onClose={() => setCommunityDrawerVisible(false)}
            open={communityDrawerVisible}
            width={500}
          >
            <Form
              form={communityForm}
              layout="vertical"
              onFinish={handleAddCommunity}
            >
              <Form.Item
                label="小区名称"
                name="name"
                rules={[{ required: true, message: '请输入小区名称' }]}
              >
                <Input placeholder="请输入小区名称" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入小区地址' }]}
              >
                <Input placeholder="请输入小区地址" />
              </Form.Item>
              <Form.Item
                label="房源数量"
                name="property_count"
                rules={[{ required: true, message: '请输入房源数量' }]}
              >
                <Input type="number" placeholder="请输入房源数量" />
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
              >
                <Input.TextArea placeholder="请输入小区描述" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setCommunityDrawerVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Drawer>

          {/* 编辑小区模态框 */}
          <Modal
            title="编辑小区"
            open={communityModalVisible}
            onCancel={() => setCommunityModalVisible(false)}
            footer={null}
          >
            <Form
              form={communityForm}
              layout="vertical"
              onFinish={handleUpdateCommunity}
            >
              <Form.Item
                label="小区名称"
                name="name"
                rules={[{ required: true, message: '请输入小区名称' }]}
              >
                <Input placeholder="请输入小区名称" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入小区地址' }]}
              >
                <Input placeholder="请输入小区地址" />
              </Form.Item>
              <Form.Item
                label="房源数量"
                name="property_count"
                rules={[{ required: true, message: '请输入房源数量' }]}
              >
                <Input type="number" placeholder="请输入房源数量" />
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
              >
                <Input.TextArea placeholder="请输入小区描述" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setCommunityModalVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* 添加客户抽屉 */}
          <Drawer
            title="添加客户"
            placement="right"
            onClose={() => setCustomerDrawerVisible(false)}
            open={customerDrawerVisible}
            width={500}
          >
            <Form
              form={customerForm}
              layout="vertical"
              onFinish={handleAddCustomer}
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
              <Form.Item
                label="电话"
                name="phone"
                rules={[{ required: true, message: '请输入客户电话' }]}
              >
                <Input placeholder="请输入客户电话" />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: '请输入客户邮箱' }]}
              >
                <Input placeholder="请输入客户邮箱" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入客户地址' }]}
              >
                <Input placeholder="请输入客户地址" />
              </Form.Item>
              <Form.Item
                label="需求"
                name="需求"
              >
                <Input.TextArea placeholder="请输入客户需求" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择客户状态' }]}
              >
                <Select placeholder="请选择客户状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">非活跃</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setCustomerDrawerVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Drawer>

          {/* 编辑客户模态框 */}
          <Modal
            title="编辑客户"
            open={customerModalVisible}
            onCancel={() => setCustomerModalVisible(false)}
            footer={null}
          >
            <Form
              form={customerForm}
              layout="vertical"
              onFinish={handleUpdateCustomer}
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
              <Form.Item
                label="电话"
                name="phone"
                rules={[{ required: true, message: '请输入客户电话' }]}
              >
                <Input placeholder="请输入客户电话" />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: '请输入客户邮箱' }]}
              >
                <Input placeholder="请输入客户邮箱" />
              </Form.Item>
              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入客户地址' }]}
              >
                <Input placeholder="请输入客户地址" />
              </Form.Item>
              <Form.Item
                label="需求"
                name="需求"
              >
                <Input.TextArea placeholder="请输入客户需求" />
              </Form.Item>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择客户状态' }]}
              >
                <Select placeholder="请选择客户状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">非活跃</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  提交
                </Button>
                <Button onClick={() => setCustomerModalVisible(false)}>
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