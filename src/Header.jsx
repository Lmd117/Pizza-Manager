import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="app-header" 
            style={{
                display: "flex",
                justifyContent: "center",  
                alignItems: "center",
                padding: "1rem",
                width: "100%",
            }}>
            <nav>
                <ul style={{ listStyleType: "none", padding: 0}}>
                    <li>
                        <Link to="/"
                            style={{
                                display: "block",
                                padding: "10px 20px",
                                backgroundColor: "#0073e6",
                                color: "white",
                                borderRadius: "8px",
                                textDecoration: "none",
                                textAlign: "center",
                                fontWeight: "bold",
                                width: "120px",
                            }}>
                                Home
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;