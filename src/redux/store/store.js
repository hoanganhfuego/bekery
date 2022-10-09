import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { unit } from '../services/unit'
import { product } from '../services/product'

export const store = configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [unit.reducerPath]: unit.reducer,
      [product.reducerPath]: product.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(unit.middleware).concat(product.middleware),
})

setupListeners(store.dispatch)