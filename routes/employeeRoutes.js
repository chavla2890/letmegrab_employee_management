const express = require("express");
const router = express.Router();
const {getEmployee, addEmployee, updateEmployee, deleteEmployee, statistics} = require('../controller/employeeControlller') 

router.get('/employees', getEmployee);

// Add employee
router.post('/employees', addEmployee);
  
// Edit employee
router.put('/employees/:id', updateEmployee);
  
// Delete employee
router.delete('/employees/:id', deleteEmployee);

//statistisc of employee
router.get('/statistics', statistics);



  module.exports = router;