import { Route, Routes } from 'react-router-dom'
import Unit from '../pages/Unit'
import Manage from '../pages/Manage'
import Product from '../pages/Product'

export default function routers(){
    return (
        <Routes>
            <Route path='/' element={<Unit/>}></Route>
            <Route path='/Product' element={<Product/>}></Route>
            <Route path='/Manage' element={<Manage/>}></Route>
        </Routes>
    )
}