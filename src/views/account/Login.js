import React from 'react'
import AppContext from '../../contexts/AppContext'
import ClientContext from '../../contexts/ClientContext'
import { CircularProgress } from '@material-ui/core'
import AuthContext from '../../contexts/AuthContext'

export default function Login({}){
    const [formData, setFormData] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    const {message} = React.useContext(AppContext)
    const {apiRequest} = React.useContext(ClientContext)
    const {signIn} = React.useContext(AuthContext)
    
    const submitLogin = e => {
        e.preventDefault()
        setLoading(true)

        apiRequest("POST", "/auth/login", {...formData})
        .then(res => {
            setLoading(false)
            signIn(res)
        })
        .catch(err => {
            setLoading(false)
            message.error(err.message)
        })
    }

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return <div className="main-wrapper">
        <div className="account-content">
            {/* <a href="job-list.html" className="btn btn-primary apply-btn">Apply Job</a> */}
            <div className="container">
            
                <div className="account-logo">
                    {/* <img src="logo-transparent.png" alt="Control printer" /> */}
                </div>
                
                <div className="account-box">
                    <div className="account-wrapper">
                        <h3 className="account-title">Login</h3>
                        <p className="account-subtitle">Digite seu usuário e senha para entrar</p>
                        
                        <form onSubmit={submitLogin}>
                            <div className="form-group">
                                <label>Usuário</label>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col">
                                        <label>Senha</label>
                                    </div>
                                    {/* <div className="col-auto">
                                        <a className="text-muted" href="forgot-password.html">
                                            Forgot password?
                                        </a>
                                    </div> */}
                                </div>
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group text-center">
                                <button disabled={loading} className="btn btn-primary account-btn" type="submit">Entrar</button>
                                {loading && <CircularProgress />}
                            </div>
                            {/* <div className="account-footer">
                                <p>Don't have an account yet? <a href="register.html">Register</a></p>
                            </div> */}
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
}