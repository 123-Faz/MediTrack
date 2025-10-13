import axios from "axios"

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URI}/api/v1`
})



export default Api