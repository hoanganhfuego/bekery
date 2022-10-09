import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const unit = createApi({
    reducerPath: 'unitApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:3001/api/'}),
    tagTypes: ['Unit'],
    endpoints: (builder) => ({
        getUnitByName: builder.query({
            query: (page) => `${page}`,
            providesTags: ['Unit']
        }),
        deleteUnit: builder.mutation({
            query(id){
                return {
                    url: `unit/${id}`,
                    method:'DELETE'
                }
            },
            invalidatesTags: ['Unit'],
        }),
        addUnit: builder.mutation({
            query(body){
                return {
                    url: `unit`,
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: ['Unit'],
        }),
        editUnit: builder.mutation({
            query({id, ...patch}){
                return {
                    url: `unit/${id}`,
                    method: 'PATCH',
                    body: patch,
                }
            },
            invalidatesTags: ['Unit']
        })
    })
})

export const { useGetUnitByNameQuery, useDeleteUnitMutation, useAddUnitMutation, useEditUnitMutation } = unit