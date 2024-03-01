import axios, { AxiosInstance, AxiosResponse } from 'axios'


type Fetching = {
    graphql: CallableFunction
}





const instanceBodas: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL_BODAS })
export const apiBodas: Fetching = {
    graphql: async (data: object): Promise<AxiosResponse> => {
        return await instanceBodas.post("/graphql", data, {})
    },
}
const instanceJaihom: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL_JAIHOM })
export const apiJaihom: Fetching = {
    graphql: async (data: object): Promise<AxiosResponse> => {
        return await instanceJaihom.post("/graphql", data, {})
    },
}