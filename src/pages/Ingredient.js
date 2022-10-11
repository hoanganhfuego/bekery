import { Space, Table, Button, Modal, Form, Input, Select } from 'antd';
import { useGetIngredientQuery, useAddIngredientMutation, useDeleteIngredientMutation, useEditIngredientMutation } from '../redux/services/ingredient'
import { useGetUnitByNameQuery } from '../redux/services/unit';
import { useState } from 'react';


export default function Ingredient(){
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: dataUnit } = useGetUnitByNameQuery('unit')
    const [isEditChooseId, setIsEditChooseId] = useState(0)

    const [editIngredient] = useEditIngredientMutation()
    const [deteteIngredient] = useDeleteIngredientMutation()
    const [addIngredient] = useAddIngredientMutation()
    const {data} = useGetIngredientQuery()


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
            title: 'Đơn vị',
            dataIndex: 'unit'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description'
        },
        {
            title: 'Số lượng tồn kho',
            dataIndex: 'quantity'
        },
        {
            title: 'Ngưỡng cảnh báo',
            dataIndex: 'warningThreshold'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size='middle'>
                        <Button type="primary" className='tw-bg-[#40a9ff]' onClick={()=>handleEditIngredient(record)}>Edit</Button>
                        <Button type="primary" className='tw-bg-[#40a9ff]' onClick={()=>handleDeleteIngredient(record.id)}>Delete</Button>
                    </Space>
                )
            }
        }

    ];

    function handleEditIngredient(data){
        setIsModalOpen(true)
        form.setFieldsValue(data)
        setIsEditChooseId(data.id)
    }

    function handleDeleteIngredient(id){
        deteteIngredient(id)
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        console.log({...form.getFieldsValue(), id: isEditChooseId})
        if(isEditChooseId){
            console.log('editing...')
            editIngredient({id: isEditChooseId, ...form.getFieldsValue()}).then(()=>form.resetFields())
            setIsEditChooseId(0)
            return
        }
        console.log('adding...')
        addIngredient({...form.getFieldsValue(), quantity:''})
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
      
    return (
        <>
            <Button type="primary" onClick={showModal} className='tw-bg-[#40a9ff]'>
                Add Ingredient
            </Button>
            <Modal title="Ingredient" open={isModalOpen} onOk={handleOk} okText='submit' onCancel={handleCancel}>
                <Form layout='vertical' form={form}>
                    <Form.Item label='Tên' name='name'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Mô tả' name='description'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Đơn vị tính' name='idUnit'>
                        <Select>
                            {dataUnit && dataUnit.map((data, index)=>{
                                return <Select.Option value={data.id} key={index}>
                                    {data.name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Số lượng tồn kho cảnh báo' name='warningThreshold'>
                        <Input type='number'/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table dataSource={newData} columns={columns} />
        </>
    )
}