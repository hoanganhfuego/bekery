import { Space, Spin, Table, Button, Modal, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useGetUnitByNameQuery, useDeleteUnitMutation, useAddUnitMutation, useEditUnitMutation } from '../redux/services/unit'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditForm = ({ data, open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  let newData = {...data}
  form.setFieldsValue(newData)
  return (
    <Modal
      forceRender
      getContainer={false}
      open={open}
      title="Edit unit"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate({id: newData.id, ...values});
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
        }}
      >
      <Form
        preserve={false}
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="name"
          label="name"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Unit(){
  const { data, error, isLoading } = useGetUnitByNameQuery('unit')
  const [deleteUnit] = useDeleteUnitMutation()
  const [addUnit] = useAddUnitMutation()
  const [editUnit] = useEditUnitMutation()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputEdit, setInputedit] = useState({})
  const addSuccess = () => toast('add success')
  const editSuccess = () => toast('edit success')

  const onCreate = (values) => {
    console.log(values)
    console.log('Received values of form: ', values);
    setOpen(false);
    editUnit(values).then(()=>editSuccess())
  };

  const onFinish = (values) => {
    console.log(values)
    addUnit(values)
    console.log('Success:', values);
    addSuccess()
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let newData = []
  if(data){
    newData = data.map((item, idx) => {
      return {
        ...item,
        key: idx + 1
      }
    })
  }
  const columns = [
    {
      title: 'Index',
      dataIndex: 'key',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return ( 
        <Space size="middle">
          <Button type="primary" onClick={() => { setInputedit(record);setOpen(true); }} className='tw-bg-[#40a9ff]'>Edit</Button>
          <button onClick={()=>deleteUnit(record.id)}>Delete</button>
        </Space>)
      },
    },
  ];
  return (
    <>
      {isLoading && <Spin />}
      {data && <div>
        <Button type="primary" onClick={showModal} className='tw-bg-[#40a9ff]'>
          Add unit
        </Button>
        <Modal title="Add Unit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required:true,
                  message: 'Please input your unit!',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required:true,
                  message: 'Please input your description!',
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" className='tw-bg-[#40a9ff]'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <EditForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
            data = {inputEdit}
          />
        <Table columns={columns} dataSource={newData} />
        </div>}
    </>
  )
}