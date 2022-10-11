import { Space, Table, Button, Modal, Form, Input, Select } from 'antd';
import { useGetTypeQuery, useAddTypeMutation, useDeleteTypeMutation, useEditTypeMutation  } from '../redux/services/type'
import { useState } from 'react';

export default function Type(){
    const {data} = useGetTypeQuery()
    const [ editType ] = useEditTypeMutation()
    const [ deleteType ] = useDeleteTypeMutation()
    const [ addType ] = useAddTypeMutation()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditChoose, setIsEditChoose] = useState(0)
    const [form] = Form.useForm()

    let newData = []
    if(data){
        newData = data.map((dt, index)=>{
            return {key: index+1, ...dt}
        })
    }
    const columns = [
        {
            title: 'Index',
            dataIndex: 'key'
        },
        {
            title: 'Tên',
            dataIndex: 'name'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size='middle'>
                        <Button type="primary" className='tw-bg-[#40a9ff]' onClick={()=>handleEdit(record)}>Edit</Button>
                        <Button type="primary" className='tw-bg-[#40a9ff]' onClick={()=>handleDelete(record.id)}>Delete</Button>
                    </Space>
                )
            }
        }
    ]

    function handleEdit(data){
        setIsModalOpen(true)
        form.setFieldsValue(data)
        setIsEditChoose(data.id)
    }

    function handleDelete(id){
        deleteType(id)
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        const inputValues = form.getFieldsValue()
        if(isEditChoose){
            console.log({id: isEditChoose, ...inputValues})
            editType({id: isEditChoose, ...inputValues})
            .then(()=>{
                setIsEditChoose(0)
                form.resetFields()
            })
            return
        }
        addType(inputValues).then(()=>form.resetFields())
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return(
        <>
            <Button type="primary" onClick={showModal} className='tw-bg-[#40a9ff]'>
                Add Type
            </Button>
            <Modal title="Ingredient" open={isModalOpen} onOk={handleOk} okText='submit' onCancel={handleCancel}>
                <Form layout='vertical' form={form}>
                    <Form.Item label='Tên' name='name'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mô tả' name='description'>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Table dataSource={newData} columns={columns} />
        </>
    )
}