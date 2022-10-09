import { Col, Divider, Row, Spin } from 'antd';
import { useGetProductByNameQuery, useAddProductMutation } from '../redux/services/product'
import { message, Form, Input, Button, Select, InputNumber, Upload, Modal} from 'antd';
import { useState } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export default function Product(){
    const { data, error, isLoading } = useGetProductByNameQuery('product')
    const [addProduct] = useAddProductMutation()
    const [form] = Form.useForm()
    const addSuccess = () => toast('add success')
    const editSuccess = () => toast('edit success')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [imageUrls, setImageUrls] = useState([])
    
    const onChange = (info) => {
        console.log(info)
        setFileList(prev => [...prev, info.fileList])
        getBase64(info.file.originFileObj, (url) => {
            setImageUrls(prev=>[...prev, url]);
            console.log(url)
        });
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

    function dummyRequest({onSuccess}){
        setTimeout(()=>onSuccess('ok'),0)
    }

    function handleSubmit(){
        let data = form.getFieldValue()
        form.resetFields()
        console.log({...data, images: [...imageUrls]})
    }

    function handleCancel(){
        setFileList([])
        setIsModalOpen(false)
    }

    function showModal(){
        setIsModalOpen(true);
    };

    let newData = [];
    if(data) {
        newData = data.map(({ name, description, unitPrice, unit, images },index)=>{
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
                    <button className='tw-border-2 tw-w-[50px]'>edit</button>
                    <button className='tw-border-2 tw-w-[50px]'>delete</button>
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
                <Form form={form} layout='vertical'>
                    <div>
                        <Form.Item label='Tên sản phẩm'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Mô tả'>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item label='Đơn vị tính'>
                            <Select />
                        </Form.Item>
                        <Form.Item label='Đơn giá'>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item label='Upload'>
                        <Upload
                            beforeUpload={beforeUpload}
                            customRequest={dummyRequest}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={(e)=>onChange(e)}
                            onPreview={onPreview}>
                            {fileList.length < 5 && '+ Upload'}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}