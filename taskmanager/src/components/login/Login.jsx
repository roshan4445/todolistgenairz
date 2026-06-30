import "./Login.css";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import {useState} from "react"
import { useNavigate,Link } from "react-router"
import Cookies from "js-cookie"

const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [ErrorMsg,setErrorMsg]=useState("")
    const navigate=useNavigate();
    const HandleEmail=(e)=>{
        setEmail(e.target.value);
    }
    const HandlePass=(e)=>{
        setPassword(e.target.value);
    }
    const Onsucess=(response)=>{
        const token=response.jwtToken
        const userId=response.userId
        Cookies.set("jwt_token",token,{
            expires:7,
            path:"/dashboard"
        })
        Cookies.set("user_id",userId,{
            expires:7,
            path:"/dashboard"
        })
        navigate("/dashboard",{replace:true})
    }
    const Onfailure=(response)=>{
        setErrorMsg(response.error)
    }
    const HandleLogin=async (e)=>{
        e.preventDefault();
        const credentails={
            "email":email,
            "password":password
        }
        console.log(credentails)
    let options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(credentails)
}

        const response=await fetch("http://localhost:3000/login",options)
        const data=await response.json()
        console.log("data",data)
        if(data.success)
        {
            Onsucess(data)
        }
        else{
            Onfailure(data)
        }
    }

        return (
        <div className="login-bg">
            <div className="sub-card">
                <div className="icon-container" id="login-top-icon-container">
                    <Lock className="top-lock-icon" size={32} />
                </div>
                <h1 className="welcome-title">Welcome Back 👋</h1>
                <p className="welcome-subtitle">Login to your account</p>
                
                <form className="login-form" onSubmit={HandleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon left-icon" size={20} />
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={HandleEmail}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon left-icon" size={20} />
                            <input 
                                id="password-input"
                                type={showPassword ? "text" : "password"} 
                                className="form-input" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={HandlePass}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="input-icon right-icon" size={20} />
                                ) : (
                                    <Eye className="input-icon right-icon" size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="forgot-password-container">
                        <a href="#forgot" className="forgot-password-link">Forgot password?</a>
                    </div>
                    
                    <button className="login-btn" type="submit">Login</button>
                    
                    <p className="register-text">
                        Don't have an account? <Link to="/register" className="register-link">Register</Link>
                    </p>
                </form>
                <p className="text-red-500 text-lg">{ErrorMsg}</p>
            </div>
        </div>  
    );
};

export default Login;