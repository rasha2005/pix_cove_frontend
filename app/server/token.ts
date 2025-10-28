import Cookies from "js-cookie"

const isProduction:boolean = process.env.NODE_ENV === "production"

function  setToken(authToken:string) {
    Cookies.set('authToken' , authToken,{
        path: '/', 
        domain:'.pix-cove-frontend.vercel.app',
        secure: true, 
        sameSite: isProduction ?'none' : 'lax'
    });
}

export default setToken;