import express from 'express';
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const router = express.Router();

// Login Route
router.post("/employee_login", async (req, res) => {
  const body  =  await req.body
  const sql = `SELECT * FROM employee WHERE email = '${body.email}'`;
  
  // Use a parameterized query to prevent SQL injection
  con.query(sql, (err, result) => {
    if (err){
      console.log(err);
      return res.json({ loginStatus: false, Error: "Query error" });
    } 
      

    if (result.length > 0) {
      // Correctly compare password using bcrypt
      bcrypt.compare(body.password, result[0].password, (compareErr, response) => {
        if (compareErr) return res.json({ loginStatus: false, Error: "Password comparison error" });
        
        if (response) {
          // Password matches
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          // Set the JWT as a cookie, with HTTP-only and secure options for production
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' // Only set secure flag in production
          });

          return res.json({ loginStatus: true, id: result[0].id });
        } else {
          // Passwords do not match
          console.log("Wrong pass" , body.password)
          return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
      });
    } else {
      // No user found with the provided email
      console.log("Wrong email")
      console.log(sql)

      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

// Employee Detail Route
router.get('/detail/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  
  // Parameterized query for fetching employee details
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true, Message: "Logged out successfully" });
});

export { router as EmployeeRouter };
