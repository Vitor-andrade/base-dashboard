import axios from 'axios'
import io from "socket.io-client";

export const getSocket = () => {
  const socket = io(process.env.REACT_APP_SERVER_URL, {
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
  })
  return socket;
}

const serverRequest = ({method, url, params, user, companyProfileId}) => {
  console.log({companyProfileId})
  return new Promise((resolve, reject) => {
    try{
      method = (method || "get").toLowerCase()
      let requestInfo = {
        method: method,
        url: url,
        baseURL: process.env.REACT_APP_SERVER_URL,
        headers: {
          "Content-Type": 'application/json',
          Language: "pt",
          CompanyProfileId: companyProfileId ? companyProfileId : null,
          Authorization: "Bearer " + (user && (user.oauth || user.oauth_token))
        }
      }

      if(method === "get") requestInfo.params = params
      else requestInfo.data = params

      // console.log(requestInfo)
      
      axios(requestInfo)
      .then(res => { 
        if(res.data.error) reject(new Error(res.data.error))
        else resolve(res.data) 
      })
      .catch(err => { reject(new Error(`Falha interna - ${err.message}`)) })
    }catch(err){
      reject(err)
    }
  })
}

export default serverRequest;
