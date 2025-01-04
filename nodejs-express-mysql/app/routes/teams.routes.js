const sql = require("../models/db.js");
module.exports = app => {
    const teams = require("../controllers/teams.controller.js");
  
    var router = require("express").Router();
    
    // Create a new Tutorial
    app.post("/teams",teams.create);
  
    // Retrieve all Tutorials
    app.get("/teams", teams.findAll);
  
    // Retrieve all published Tutorials
    app.get("/published", teams.findAllPublished);
  
    // Retrieve a single Tutorial with id
    app.get("/teams/:id", teams.findOne);
  
    // Update a team with id
    app.put("/teams/:id", /* teams.validate, */ teams.update);
  
    // Delete a Tutorial with id
    app.delete("/teams/:id", teams.delete);

    app.get("/lookups/:lookupTable", (req, result)=>{
      let query = "SELECT CONCAT(first_name, ' ', last_name) as label, id as value FROM people WHERE person_type='coach'";

      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
    
        console.log("coaches: ", res);
        //result(null, res);
        result.send(res);
      });
    });



    app.use('/api/teams', router);

  };