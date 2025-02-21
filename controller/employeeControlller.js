const express = require("express");
const router = express.Router();
const db = require('../config/db');

const getEmployee = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
  
    const query = 'SELECT * FROM Employee LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }

const addEmployee = (req, res) => {
    const { department_id, name, dob, phone, photo, email, salary } = req.body;
    const query = 'INSERT INTO Employee (department_id, name, dob, phone, photo, email, salary) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [department_id, name, dob, phone, photo, email, salary], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId });
    });
}

const updateEmployee =  (req, res) => {
    const { department_id, name, dob, phone, photo, email, salary } = req.body;
    const query = 'UPDATE Employee SET department_id = ?, name = ?, dob = ?, phone = ?, photo = ?, email = ?, salary = ? WHERE id = ?';
    db.query(query, [department_id, name, dob, phone, photo, email, salary, req.params.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Employee updated successfully' });
    });
  }

  const deleteEmployee = (req, res) => {
    const query = 'DELETE FROM Employee WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Employee deleted successfully' });
    });
  }


  const statistics =  (req, res) => {
    const queries = {
        highestSalary: `
            SELECT d.name, MAX(e.salary) AS highest_salary 
            FROM Employee e 
            JOIN Department d ON e.department_id = d.id 
            GROUP BY d.name
        `,
        salaryRange: `
            SELECT 
                CASE 
                    WHEN salary BETWEEN 0 AND 50000 THEN '0-50000' 
                    WHEN salary BETWEEN 50001 AND 100000 THEN '50001-100000' 
                    ELSE '100000+' 
                END AS salary_range, 
                COUNT(*) AS count 
            FROM Employee 
            GROUP BY salary_range
        `,
        youngestEmployee: `
            SELECT d.name AS department_name, e.name AS youngest_name, 
                   TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) AS age 
            FROM Employee e 
            JOIN Department d ON e.department_id = d.id 
            WHERE (e.department_id, e.dob) IN (
                SELECT department_id, MIN(dob) 
                FROM Employee 
                GROUP BY department_id
            )
        `
    };

    db.query(queries.highestSalary, (err, highestSalaryResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.query(queries.salaryRange, (err, salaryRangeResults) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            db.query(queries.youngestEmployee, (err, youngestEmployeeResults) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    highestSalary: highestSalaryResults,
                    salaryRange: salaryRangeResults,
                    youngestEmployee: youngestEmployeeResults
                });
            });
        });
    });
}
  module.exports = {getEmployee, addEmployee, updateEmployee, deleteEmployee, statistics};