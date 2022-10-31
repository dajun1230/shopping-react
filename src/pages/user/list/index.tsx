import { Row, Form, Input, Button, Table } from 'antd';
import createModal from './create-modal';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '3',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '4',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '5',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '6',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '7',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '8',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '9',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '10',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

const UserList = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Finish:', values);
  };

  const handleAddUser = async () => {
    const data = await createModal({ id: '123' });
    console.log('data', data);
  };

  return (
    <div>
      <Row style={{ marginBottom: 20 }}>
        <Form
          form={form}
          name='horizontal_login'
          layout='inline'
          onFinish={onFinish}
        >
          <Form.Item label='用户名' name='username'>
            <Input placeholder='Username' />
          </Form.Item>
          <Form.Item label='密码' name='password'>
            <Input type='text' placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Button type='primary' onClick={handleAddUser}>
          新增
        </Button>
      </Row>
      <Row>
        <Table
          style={{ width: '100%' }}
          dataSource={dataSource}
          columns={columns}
        />
      </Row>
    </div>
  );
};

export default UserList;
