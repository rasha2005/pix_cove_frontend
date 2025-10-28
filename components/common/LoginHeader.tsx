import Link from "next/link";


export default function LoginHeader() {
    const websiteName = "PixCove";
    return (
        <>
         <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-gray-900 mr-8">
        {websiteName}
      </Link>

    

      <div className="flex items-center space-x-4 ml-8">
      <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
    Explore
  </Link>
        <Link href="/register" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
         Register
          
        </Link>
        
       
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Log in
          </Link>
      

        
      
      </div>
    </header>
        </>
    )
}