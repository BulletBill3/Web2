const sql = require("./db.js");

// constructor
const Teams = function(teams) {
  //this.name = teams.email;
  this.name = teams.name;
  this.coach_id = teams.coach_id;
  this.league_id = teams.league_id;
  this.motto = teams.motto;
  this.notes = teams.notes;
  //this.active = teams.active;
};

Teams.checkDuplicateName = (checkName, result) => {
  sql.query(`SELECT * FROM teams WHERE name =  ${checkName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found teams with duplicate namne: ", res[0]);
      result(null, res[0]);
      return true;// return true if found duplicate
    }

    // not found Teams with the id
    result({ kind: "not_found" }, null);
    return false; //return false if no duplicate
  });
};
Teams.create = (newTeams, result) => {

  sql.query("INSERT INTO teams SET ?", newTeams, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created teams: ", { id: res.insertId, ...newTeams });
    result(null, { id: res.insertId, ...newTeams });
  });
};

Teams.findById = (id, result) => {
  sql.query(`SELECT * FROM teams WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found teams: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Teams with the id
    result({ kind: "not_found" }, null);
  });
};

/* Teams.sort = (sortCol, sortDir, result) => {
/* console.log("in team.sort")
console.log(sortCol) 

  sql.query(`SELECT * FROM teams ORDER BY ${sortCol} ${sortDir} `,  (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`sorted teams`);
    result(null, res);
  });
}; */

Teams.getAll = (sortCol, sortDir, limit, offset, filterCol, filterStr,  result) => {
  if(sortDir === 'dsc'){
    sortDir = 'DESC';
  }
  let query = "SELECT * FROM teams";
if(filterCol){
  query = query + ` WHERE ${filterCol} LIKE "%${filterStr}%"`;
  console.log(query);
}
if(sortCol){
  query = query + ` ORDER BY ${sortCol} ${sortDir}`;
  console.log(query);
}
if(limit){
  query = query + ` LIMIT ${limit} OFFSET ${offset}`;
  console.log(query);
}
  //query = "SELECT * FROM teams WHERE name LIKE 'Team Traeger' ORDER BY name ASC LIMIT 3 OFFSET 0 ";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("teams: ", res);
    result(null, res);
  });
};

/* Teams.paging = (limit, offset, result) => {
  sql.query(`SELECT * FROM teams LIMIT ${limit} OFFSET ${offset}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("teams: ", res);
    result(null, res);
  });
};
 */
/* Teams.filter = (filterCol,filterStr, result) => {
  sql.query(`SELECT * FROM teams WHERE ${filterCol} LIKE '${filterStr}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("teams: ", res);
    result(null, res);
  });
}; */

Teams.updateById = (id, teams, result) => {
  sql.query(
    "UPDATE teams SET name = ?, coach_id = ?, league_id= ?, motto = ?, notes = ?  WHERE id = ?",
    [ teams.name, teams.coach_id, teams.league_id, teams.motto, teams.notes, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Teams with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated teams: ", { id: id, ...teams });
      result(null, { id: id, ...teams });
    }
  );
};

Teams.remove = (id, result) => {
  sql.query("DELETE FROM teams WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Teams with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted teams with id: ", id);
    result(null, res);
  });
};



module.exports = Teams;