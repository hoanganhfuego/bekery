import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const type = createApi({
    reducerPath: 'typeApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:3001/api/product/type'}),
    tagTypes: ['Type'],
    endpoints: (builder)=>({
        getType: builder.query({
            query: () => '',
            providesTags: ['Type']
        }),
        addType: builder.mutation({
            query(body){
                return {
                    url: '',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: ['Type']
        }),
        deleteType: builder.mutation({
            query(id){
                return {
                    url: `${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['Type']
        }),
        editType: builder.mutation({
            query({id, ...patch}){
                return {
                    url: `${id}`,
                    method: 'PATCH',
                    body: patch
                }
            },
            invalidatesTags: ['Type']
        })
    })
})

export const { useGetTypeQuery, useAddTypeMutation, useDeleteTypeMutation, useEditTypeMutation } = type