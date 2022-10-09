import { Slider } from 'antd'
import "antd/dist/antd.css";

export default function Header(){
    const marks = {
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: {
          style: {
            color: '#f50',
          },
          label: <strong>100°C</strong>,
        },
      };
    return (
        <div className="w-[30%] flex flex-col items-center bg-slate-500 p-3">
            <p>manage</p>
            <div className='create-delete w-[100%] flex justify-between'>
                <button className='rounded-lg border-2 p-1'>create</button>
                <button className='rounded-lg border-2 p-1'>delete</button>
            </div>
            <div className='input-field '>
                <input placeholder='tên sản phẩm' type='text'></input>
                <input type='date'></input>
                <Slider marks={marks} step={null} defaultValue={37} />
            </div>
        </div>
    )
}