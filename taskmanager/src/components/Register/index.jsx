import { Link, useNavigate } from "react-router";
import { Lock, Mail, Eye, User, EyeOff } from "lucide-react";
import "./index.css";
import { useState } from "react";

const Register = () => {
    const navigate = useNavigate();
    const [fullName,setfullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [ErrorMsg,setErrorMsg]=useState("")
    const [showPassword,setShowPassword]=useState(false)
    const handlefullname=(e)=>{
        setfullName(e.target.value)
    }
    const handleemail=(e)=>{
        setEmail(e.target.value)
    }
    const handlepassword=(e)=>{
        setPassword(e.target.value)
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const details={
            name:fullName,
            email,
            password
        }
        const options={
            "method":"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(details)
        }
        const response=await fetch("https://todolistgenairz.onrender.com/register",options)
        const data = await response.json()
        if(response.ok)
        {
            navigate("/login")
        }
        else{
            setErrorMsg(data.error)
        }
       
    }
    return (
        <div className="register-bg">
            <div className="sub-card">
                <div className="icon-container" id="register-top-icon-container">
                    <User className="top-user-icon" size={32} />
                </div>
                <h1 className="welcome-title">Create Account</h1>
                <p className="welcome-subtitle">Register to get started</p>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon left-icon" size={20} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={handlefullname}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon left-icon" size={20} />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleemail}
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
                                placeholder="Create a password"
                                value={password}
                                onChange={handlepassword}
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


                    <button className="register-btn" type="submit">
                        Create Account
                    </button>

                    <p className="login-link-text">
                        Already have an account? <Link to="/login" className="login-link">Login</Link>
                    </p>
                </form>
                <p className="text-red-500 text-lg">{ErrorMsg}</p>
            </div>
        </div>
    );
};

export default Register;