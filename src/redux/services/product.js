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
        }),
        editProduct: builder.mutation({
            query({id, ...patch}){
                return {
                    url: `product/${id}`,
                    method: 'PATCH',
                    body: patch
                }
            },
            invalidatesTags: ['Product']
        }),
        deleteProduct: builder.mutation({
            query(id){
                return {
                    url: `product/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['Product']
        })
    })
})

export const { useGetProductByNameQuery, useAddProductMutation, useEditProductMutation, useDeleteProductMutation } = product