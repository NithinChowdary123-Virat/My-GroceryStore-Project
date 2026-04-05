import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "../../css/Profile.css/";
function Profile(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/'); // if not logged in
        }
    }, []);
    return (
        <div className="profile-page" >
            <h2>My Profile</h2>

            <div className="profile-card">
                {user ? (
                        <>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                <button onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    )
}
export default Profile;