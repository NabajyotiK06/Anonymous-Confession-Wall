import React from "react";
import { LogOut, User, Ghost } from "lucide-react";

function Navbar({ user }) {
    return (
        <nav className="navbar">
            <a href="/" className="logo">
                <Ghost size={24} className="text-accent" />
                <span>ConfessWall</span>
            </a>

            <div className="user-menu">
                {user ? (
                    <>
                        <div className="user-name">
                            <span style={{ opacity: 0.7 }}>Logged in as </span>
                            <strong>{user.displayName}</strong>
                        </div>
                        <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/logout`} className="nav-btn" title="Logout">
                            <LogOut size={20} />
                        </a>
                    </>
                ) : (
                    <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/google`} className="btn-primary">
                        <User size={18} />
                        <span>Login with Google</span>
                    </a>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
