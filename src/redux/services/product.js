import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const product = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({baseUrl:'http://127.0.0.1:3001/api/'}),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProductByName: builder.query({
            query: (page) => `${page}`,
            providesTags: ['Product']
        }),
        addProduct: builder.mutation({
            query(body){
                return {
                    url: 'product',
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: ['Product']
        })
    })
})

export const { useGetProductByNameQuery, useAddProductMutation } = product