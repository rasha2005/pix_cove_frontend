import setToken from "../server/token"
import { Api } from "./apiconfig"
import { endpoints } from "./endpoints"

export const handleRegister = async(data:RegisterFormValues) => {
    const res = await Api.post(endpoints.register, {data})
    return res
}

export const handleLogin = async(data:LoginFormValues) => {
    const res = await Api.post(endpoints.login , {data});
    if(res.data.success === true) {
        const token = res.data?.token;
        setToken(token);
    }
    return res
}

export const uploadImages = async(data:securedImages[]) => {
    const res = await Api.post(endpoints.upload , {data});
    return res
}

export const getAllImages = async() => {
    const res = await Api.get(endpoints.getImages);
    return res
}

export const getImageById = async(page:number , limit:number) => {
    const res = await Api.get(endpoints.userImages ,{
        params: { page, limit }
    } );
    return res
}

export const deletImageById = async(imgId:string | undefined) => {
    const res = await Api.delete(endpoints.deleteImage ,{
        params:{imgId}
    } );
    return res
}

export const editImageById = async(imgId:string | undefined , title:string , img_url:string) => {
    console.log(imgId , title, img_url)
    const res = await Api.put(endpoints.editImage ,{imgId , title, img_url});
    return res
}

export const changePassword = async(current:string , confirm:string) => {
    const res = await Api.put(endpoints.passwordReset ,{current , confirm,});
    return res
}

export const verifyEmail = async(token:string | null) => {
    console.log("huhu")
    const res = await Api.get(`/user/verify-email?token=${token}`);
    return res;
  };
  