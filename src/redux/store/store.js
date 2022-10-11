import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { unit } from '../services/unit'
import { product } from '../services/product'
import { type } from '../services/type'
import { ingredient } from '../services/ingredient'

export const store = configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [unit.reducerPath]: unit.reducer,
      [product.reducerPath]: product.reducer,
      [type.reducerPath]: type.reducer,
      [ingredient.reducerPath]: ingredient.reducer
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(unit.middleware).concat(product.middleware).concat(type.middleware).concat(ingredient.middleware),
})

setupListeners(store.dispatch)