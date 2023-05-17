import axios, { AxiosInstance, AxiosResponse } from 'axios'


type Fetching = {
    graphql: CallableFunction
}



const instance: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })


export const api: Fetching = {
    graphql: async (data: object): Promise<AxiosResponse> => {
        return await instance.post("/graphql", data, {})
    },

}