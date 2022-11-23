import path from "path";
import express from "express";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { Round } from "./SeatAllotment.js";
import { retrieveData } from "./data.js";
import { PostAllotment } from "./PostAllotment.js";
import { pool } from "./database.js";

// const PORT = process.env.PORT | 3001;
const PORT = 3001;
let applicants = [];
let branches = [];
let total_rounds = 2;

const app = express();
app.use(express.json());
// if(process.env.NODE_ENV === "production"){
//     //app.use(express.static(path.resolve(__dirname, './frontend/build')));
// }

const process = async () => {
  await pool.query("TRUNCATE students;");
  await retrieveData(applicants, branches);

  for (let round_no = 1; round_no < total_rounds + 1; ++round_no) {
    console.log(`ROUND ${round_no}\n\n`);
    Round(applicants, branches);
    PostAllotment(applicants, branches, round_no, total_rounds);
  }
  //applicants.map((applicant)=> console.log(applicant.id, applicant.prefs))
};

app.get("/load", async (req, res) => {
  /* console.log(req.url)
    applicants = []
    branches = []
    await process()
    //res.json({ message: "Hello from server!" });
    res.json(applicants[0]) */
  const applicant_info = await pool.query(
    "SELECT id, status, prefs  FROM applicants WHERE id = ($1);",
    []
  );

  const branches_table = await pool.query("SELECT * FROM branches;");

  const branch_alloted = branches_table.rows.find((b) => {
    return b.status === applicant_info.rows[0].status;
  });
});

app.post("/store", async (req, res) => {
    try {
        console.log("Data is -> \n");
        console.log(req.body.data);
        console.log(req.body.data.a);
        console.log(req.body.data.b);
    
        const {id, first_name, middle_name, last_name, father_name, address1, address2, zip} = req.body.data.a
        const {board_10, percentage_10, yop_10, rollno_10, board_12, percentage_12, yop_12, rollno_12, application_no, mains_rank } = req.body.data.d
        const {dsp, waiting} = req.body.data.p
    
        console.log(id, first_name, middle_name, last_name, father_name, address1, address2, zip)
        await pool.query(
        `INSERT INTO personaldetails(id, first_name, middle_name, last_name, father_name, address1, address2, zip)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [id, first_name, middle_name, last_name, father_name, address1, address2, zip]
        );
    
        await pool.query(
        `INSERT INTO academicdetails
        (id, board_10, percentage_10, yop_10, rollno_10, board_12, percentage_12, yop_12, rollno_12, application_no, mains_rank)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
        [id,board_10, percentage_10, yop_10, rollno_10, board_12, percentage_12, yop_12, rollno_12, application_no, mains_rank]
        );

        /* await pool.query(
          `INSERT INTO applicants(id, percentile, prefs, status, on_hold) VALUES ( $1, $2, ARRAY $3:: pref[], $4, $5)`,
          [id, mains_rank, prefs,-1, false]
        ); */
        
    } catch (error) {
        console.log(error)
    }


    //INSERT INTO applicants(id, percentile, prefs, status, on_hold) VALUES ( 1, 100, ARRAY [('CSE', 100), ('CCE', 100), ('ECE', 100)]:: pref[], -1, false) 
});

app.get("*", (req, res) => {
  res.send("<h1>Error!</h1><br/><p>Change URL</p>");
});

app.listen(PORT, async () => {
  console.clear();
  console.log(`Server listening on ${PORT}`);
});
