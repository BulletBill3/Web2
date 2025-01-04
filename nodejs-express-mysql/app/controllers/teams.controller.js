const Teams = require("../models/teams.model.js");
const { body,validationResult } = require('express-validator');

exports.validate = (method) => {
  let rules = [
    body('name', "name cannot be empty").not().isEmpty().trim().escape(),
    body('coach_id', "coach ID cannot be empty").not().isEmpty().trim().escape(),
    body('league_id', "league ID cannot be empty").not().isEmpty().trim().escape(),
    body('notes').trim().escape(),
    body('motto').trim().escape()
  ]
  if(method === 'updateTeam'){
    return rules
  }
  if(method === 'createTeam'){
    rules.push(
    body('name').custom( (value) => {
      return Teams.checkDuplicateName(value)
    }))
  }
  return rules;
  }

// Create and Save a new Teams
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Teams
    const teams = new Teams({
      //coach_id: req.body.coach_id,
      name: req.body.name,
      coach_id: req.body.coach_id,
      league_id: req.body.league_id,
      motto: req.body.motto,
      notes: req.body.notes,
    
    });
  
    // Save Teams in the database
  //if(!Teams.checkDuplicateName && req.body.name){
    Teams.create(teams, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Teams."
        });
      else res.status(201).send(data);
    });
  //}
  };

// Retrieve all Teams from the database (with condition).
exports.findAll = (req, res) => {
    const sortCol = req.query.sortCol;
    const sortDir = req.query.sortDir;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const filterCol = req.query.filterCol;
    const filterStr = req.query.filterStr;
 
      Teams.getAll(sortCol, sortDir, limit, offset, filterCol, filterStr, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving teams."
          });
        else res.send(data);
      });
  
  };
  
  exports.findAllPublished = (req, res) => {
    Teams.getAllPublished((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving teams."
        });
      else res.send(data);
    });
  };

// Find a single Teams with a id
exports.findOne = (req, res) => {
    Teams.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Teams with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Teams with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };

// find all published Teamss
exports.findAllPublished = (req, res) => {
  
};

// Update a Teams identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Teams.updateById(
      req.params.id,
      new Teams(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Teams with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Teams with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a Teams with the specified id in the request
exports.delete = (req, res) => {
    Teams.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Teams with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Teams with id " + req.params.id
          });
        }
      } else res.send({ message: `Teams was deleted successfully!` });
    });
  };

