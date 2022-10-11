import { Col, Divider, Row, Spin } from 'antd';
import { useGetProductByNameQuery, useAddProductMutation, useEditProductMutation, useDeleteProductMutation } from '../redux/services/product'
import { useGetTypeQuery } from '../redux/services/type';
import { useGetIngredientQuery } from '../redux/services/ingredient';
import { useGetUnitByNameQuery } from '../redux/services/unit';
import { message, Form, Input, Button, Select, Upload, Modal} from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uuid from 'react-uuid';
import { editableInputTypes } from '@testing-library/user-event/dist/utils';

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
  
    const isLt2M = file.size / 1024 / 1024 < 2;
  
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
  
    return isJpgOrPng && isLt2M;
};

function dummyRequest({onSuccess}){
    setTimeout(()=>onSuccess('ok'),0)
}

export default function Product(){
    const { data, isLoading } = useGetProductByNameQuery('product')
    const { data: dataType } = useGetTypeQuery()
    const { data: dataIngredient } = useGetIngredientQuery()
    const { data: dataUnit } = useGetUnitByNameQuery('unit')
    const [addProduct] = useAddProductMutation()
    const [editProduct] = useEditProductMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [imageUrls, setImageUrls] = useState([])
    const [ingredientObjArr, setIngredientObjArr] = useState([])
    const [isEditChoose, setIsEditChoose] = useState(false)
    const [editType, setEditType] = useState([])
    let newData = [];
    const onChange = (info) => {
        const reader = new FileReader()
        console.log(info)
        reader.readAsDataURL(info.file.originFileObj)
        reader.onload = ()=>{
            console.log('xin chao 2')
            setImageUrls(prev => [...prev, {base64: reader.result, name: uuid()}])
        }
        setFileList(info.fileList)
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
    
            reader.onload = () => resolve(reader.result);
          });
        }
    
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    function handleSubmit(){
        let data = form.getFieldValue()
        form.resetFields()
        if(isEditChoose){
            editProduct({...data, fileBase64ObjArr: imageUrls, ingredientObjArr: ingredientObjArr})
            .then(()=>{
                toast('edit product success');
                setIsEditChoose(false)
                setIsModalOpen(false)
                setFileList([])
                setImageUrls([])
            })
            .catch(()=>{
                toast('edit product false')
                setFileList([])
                setImageUrls([])
            })
            return 
        }
        console.log({...data, fileBase64ObjArr: imageUrls, ingredientObjArr: ingredientObjArr})
        addProduct({...data, fileBase64ObjArr: imageUrls, ingredientObjArr: ingredientObjArr}).unwrap()
        .then(()=>{
            setFileList([])
            setImageUrls([])
            setIngredientObjArr([])
            toast('add product success')
        })
        .catch(()=>{
            setIngredientObjArr([])
            setFileList([])
            setImageUrls([])
            toast('add product false')
        })
    }

    function handleCancel(){
        setFileList([])
        setImageUrls([])
        setIsModalOpen(false)
    }

    function showModal(){
        setFileList([])
        setIsEditChoose(false)
        setIsModalOpen(true);
        form.resetFields()
    };

    function onFinish(values){
        const ingredient = dataIngredient.filter(ingredient=>{
            return ingredient.id == values.idIngredient
        })[0]
        setIngredientObjArr(prev => [...prev,{
            amount: values.amount,
            idIngredient: values.idIngredient,
            isCreated: true,
            isDeleted: false,
            isModified: false,
            name: ingredient.name + ' - ' + ingredient.unit 
        }])
    }
    function handleDeleteIngredient(values){
        setIngredientObjArr(ingredientObjArr.filter(item => item.idIngredient !== values))
    }

    function handleRenderIngredients(){
        return ingredientObjArr.map((ingredient, index)=>{
            return (
                <div key={index} className='tw-flex tw-justify-between'>
                    <p>{ingredient.name}</p>
                    <p>{ingredient.amount}</p>
                    <button onClick={()=>handleDeleteIngredient(ingredient.idIngredient)}>delete</button>
                </div>
            )
        })
    }

    function handleEditProduct(info){
        console.log(info)
        setIsEditChoose(true)
        setIsModalOpen(true)
        form.setFieldsValue(info)
        console.log(info.idTypes.split(';').map((type, index)=>{
            return dataType.filter(data => {
                return data.id == type
            })[0].name
        }))
        setEditType(info.idTypes.split(';'))
        setFileList(info.images.split(';').map((url, index)=>{
            return {
                uid: index,
                url: 'http://127.0.0.1:3001/public/img/' + url,
                name: url
            }
        }))
    }

    function handleDeleteProduct(id){
        deleteProduct(id)
    }

    if(data) {
        newData = data.map((info,index)=>{
            const {id, name, description, unitPrice, unit, images } = info
            let newImage = 'http://127.0.0.1:3001/public/img/'+images.split(';')[0]
            return (
            <Col span={6} key={index}>
                <img src={newImage}></img>
                <div className='tw-text-ellipsis tw-overflow-hidden tw-whitespace-nowrap'>{name}</div>
                <p className='tw-text-ellipsis tw-overflow-hidden tw-whitespace-nowrap'>{description}</p>
                <div>
                    <span>{unitPrice} đ/</span>
                    <span>{unit}</span>
                </div>
                <div className='tw-flex tw-justify-between'>
                    <button className='tw-border-2 tw-w-[50px]' onClick={()=>handleEditProduct(info, id)}>edit</button>
                    <button className='tw-border-2 tw-w-[50px]' onClick={()=>handleDeleteProduct(id)}>delete</button>
                </div>
            </Col>)
        })
    }

    return(
        <>
            {isLoading && <Spin />}
            <Button type="primary" onClick={showModal} className='tw-bg-[#40a9ff] tw-float-right'>
                Add Product
            </Button>
            <Row gutter={[24, 24]}>
                {data && newData}
            </Row>
            <Modal forceRender className='tw-w-[80vw]' getContainer={false} open={isModalOpen} onOk={handleSubmit} onCancel={handleCancel} okText='submit'>
                <Form form={form} layout='vertical' initialValues={{name:'', description:'', idUnit: '', unitPrice:'', fileBase64ObjArr:[], imageObjArr:[], ingredientObjArr: [], types:[]}}>
                    <div className='tw-flex tw-justify-between'>
                        <Form.Item label='Tên sản phẩm' name='name' className='tw-w-[45%]'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Mô tả' name='description' className='tw-w-[45%]'>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='tw-flex tw-justify-between'>
                        <Form.Item label='Đơn vị tính' name='idUnit' className='tw-w-[45%]'>
                            <Select>
                                {dataUnit && dataUnit.map((data, index)=>{
                                    return <Select.Option value={data.id} key={index}>
                                        {data.name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label='Đơn giá' name='unitPrice' className='tw-w-[45%]'>
                            <Input type='number'/>
                        </Form.Item>
                    </div>
                    <Form.Item label='Thể loại' name='types'>
                        <Select mode='multiple'>
                            {
                                dataType && dataType.map((data, index)=>{
                                    return <Select.Option key={index} value={data.id}>{data.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label='Upload'>
                        <Upload
                            beforeUpload={beforeUpload}
                            customRequest={dummyRequest}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}>
                            {fileList.length < 5 && '+ Upload'}
                        </Upload>
                    </Form.Item>
                </Form>
                <div className='tw-flex tw-flex-col'>
                    <div className='tw-mb-[20px]'>Danh sách nguyên liệu</div>
                    <Form title='Danh sách nguyên liệu' className='tw-flex tw-flex-row tw-w-[100%] tw-justify-between tw-items-center' onFinish={onFinish}>
                        <Form.Item name='idIngredient' label='Nguyên liệu' className='tw-w-[40%]'>
                            <Select>
                                {
                                    dataIngredient && dataIngredient.map((data, index)=>{
                                        return <Select.Option key={index} value={data.id}>{data.name} - {data.unit}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='amount' label='Số lượng' className='tw-w-[40%]'>
                            <Input type='number'/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType='submit' className='tw-bg-[#40a9ff]'>
                                Thêm mới
                            </Button>
                        </Form.Item>
                    </Form>
                    {handleRenderIngredients()}
                </div>
            </Modal>
        </>
    )
}