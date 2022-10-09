import { Link } from "react-router-dom"

export default function Header(){
    return (
        <div className='header h-[70px] flex items-center bg-[orange] p-3'>
            <ul className=" list-none flex justify-around items-center w-[100%]">
                <Link to='/'><li>Unit</li></Link>
                <Link to='/Ingredient'><li>Ingredient</li></Link>
                <Link to='/Product'><li>Product</li></Link>
                <Link to='/Manage'><li>Type of product</li></Link>
            </ul>
        </div>
    )
}