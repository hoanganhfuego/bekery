import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ingredient = createApi({
    reducerPath: 'ingredientApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:3001/api/ingredient'}),
    tagTypes: ['Ingredient'],
    endpoints: (builder) => ({
        getIngredient: builder.query({
            query: () => '',
            providesTags: ['Ingredient']
        }),
        addIngredient: builder.mutation({
            query(body){
                return {
                    url: '',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: ['Ingredient']
        }),
        deleteIngredient: builder.mutation({
            query(id){
                return {
                    url: `/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['Ingredient']
        }),
        editIngredient: builder.mutation({
            query({id, ...patch}){
                return {
                    url: `${id}`,
                    method: 'PATCH',
                    body:patch
                }
            },
            invalidatesTags: ['Ingredient']
        })
    }),
})

export const { useGetIngredientQuery, useAddIngredientMutation, useDeleteIngredientMutation, useEditIngredientMutation } = ingredient