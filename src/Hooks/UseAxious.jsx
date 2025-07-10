import axios from 'axios'
const axiosIntences = axios.create({
    baseURL: `http://localhost:3000`,
})
function UseAxios() {
    return axiosIntences
}

export default UseAxios
