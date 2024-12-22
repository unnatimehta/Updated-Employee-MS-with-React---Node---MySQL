import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                console.log("Fetching employee details...");
                const res = await axios.get('http://localhost:3000/employee/detail/' + id);
                console.log("API Response Data:", res.data);

                if (res.status === 200 && res.data.Status) {
                    if (res.data.Result && res.data.Result.length > 0) {
                        setEmployee(res.data.Result[0]);
                    } else {
                        console.log("No employee data found.");
                    }
                } else {
                    console.error("API returned a non-successful status.");
                }
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };

        fetchEmployeeDetails();
    }, [id]);

    const handleLogout = () => {
        console.log("Logging out...");
        axios.get('http://localhost:3000/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    console.log("Logout successful.");
                    localStorage.removeItem("valid");
                    navigate('/');
                } else {
                    console.error("Logout failed.");
                }
            })
            .catch(err => console.error("Error during logout: ", err));
    };

    return (
        <div>
            <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Management System</h4>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                {employee.image ? (
                    <img 
                        src={`http://localhost:3000/Images/${employee.image}`} 
                        className='emp_det_image' 
                        alt="Employee" 
                    />
                ) : (
                    <p>Loading employee image...</p>
                )}
                <div className='d-flex align-items-center flex-column mt-5'>
                    <h3>Name: {employee.name || 'Loading...'}</h3>
                    <h3>Email: {employee.email || 'Loading...'}</h3>
                    <h3>Salary: Rs.{employee.salary || 'Loading...'}</h3>
                </div>
                <div>
                    <button className='btn btn-primary me-2'>Edit</button>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
