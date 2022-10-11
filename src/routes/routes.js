import { Route, Routes } from 'react-router-dom'
import Unit from '../pages/Unit'
import Ingredient from '../pages/Ingredient'
import Product from '../pages/Product'
import Type from '../pages/Type'

export default function routers(){
    return (
        <Routes>
            <Route path='/' element={<Unit/>}></Route>
            <Route path='/Product' element={<Product/>}></Route>
            <Route path='/Ingredient' element={<Ingredient/>}></Route>
            <Route path='/Type' element={<Type/>}></Route>
        </Routes>
    )
}