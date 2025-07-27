import axios from 'axios'
const axiosIntences = axios.create({
    baseURL: `https://server-one-jet-28.vercel.app`,
})
function UseAxios() {
    return axiosIntences
}

export default UseAxios
