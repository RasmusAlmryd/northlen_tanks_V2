import { Route, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useState,useEffect } from "react";

export default function RequireAuth({ children, redirectTo }) {
  const {loggedIn} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(loggedIn, 'private route');
    if(!loggedIn) {
      navigate('/')
    }
  }, [loggedIn])

 
  return children;
}