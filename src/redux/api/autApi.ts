import { baseApi } from "./baseApi"

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) =>( {
        login: builder.mutation({
            query: (userInfo) => {
                console.log(userInfo,"in redux api")
                return {
                
                    url: "/auth/login",
                        method: "POST",
                        body:userInfo
                }
            }
        }),


        register: builder.mutation({
            query: (userInfo) => {
                console.log(userInfo)
                return {
                    url: "/auth/register",
                        method: "POST",
                        body:userInfo
                }
            }
        }),
      
        
    })
})
export const {useLoginMutation,useRegisterMutation } = authApi