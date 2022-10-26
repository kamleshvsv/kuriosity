import { useNavigate } from "react-router-dom";

export function NotFoundComponent () {
    const navigate =  useNavigate()
    return (
        <div className="mb-5">
            <div className="text-white text-center p-10">
                <h1 className="text-4xl font-bold">Not Found</h1>
                <button className="mt-10 border py-1 px-5" onClick={()=> {
                navigate('/')
                }}>Back To Home</button>

            </div>
        </div>
      );
}