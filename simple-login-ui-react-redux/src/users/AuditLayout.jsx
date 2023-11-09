import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';


export { AuditLayout };

function AuditLayout() {
    const [users, setUsers] = useState([]);
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

    useEffect(() => {
        const getAudit = async () => {
            try {
                //const user = localStorage.getItem('auth');
                const storedAuth = JSON.parse(localStorage.getItem('auth'));
                const token = storedAuth && storedAuth.token;
                const userId = storedAuth && storedAuth.user && storedAuth.user._id;
                console.log(userId);
                const response = await fetch(`${baseUrl}/audit/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if(result){
                    setUsers(result);
                }
                console.log(result);
            } catch (err) {
                console.log(err);
            }
        }
        getAudit();
    }, []);

    console.log("users", users);
    return (
        <div className="p-4">
            <div className="container">
                <div>
                    <h1>Users</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>UserName</th>
                                <th style={{ width: '25%' }}>LoginTime</th>
                                <th style={{ width: '25%' }}>LogoutTime</th>
                                <th style={{ width: '25%' }}>ClientIp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length >0 && users.map(user => user.loginHistory.map(item =>
                                <tr key={item._id}>
                                    <td>{user.username}</td>
                                    <td>{item.loginTime || ""}</td>
                                    <td>{item.logoutTime || "Currently loggedIn"}</td>
                                    <td>{item.clientIp || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
