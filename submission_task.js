const { exec } = require("child_process");

exec("npx codestates-submission ls", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  let submit_tasks = stdout
    .split(".\n")[1]
    .replace(/\n|\s|\[|\]/g, "")
    .replace(/},{/g, "} {")
    .split(" ");

  let submit_object = [];
  for (let i = 0; i < submit_tasks.length; i++) {
    let object = submit_tasks[i].replace(/\{|\}/g, "").split(",");
    let tmpObject = {};
    tmpObject.name = object[0].split("name:")[1].replace(/'/g, "");
    tmpObject.timestamp = object[1].split("timestamp:")[1].replace(/'/g, "");
    tmpObject.date = new Date(Date.parse(tmpObject.timestamp));
    submit_object.push(tmpObject);
  }
  submit_object = submit_object.sort((a, b) => {
    return a.date - b.date;
  });
  // console.log(submit_object);

  let latestSubmit = {};
  for (let i = 0; i < submit_object.length; i++) {
    let projectName = submit_object[i].name;
    // console.log(projectName, latestSubmit[projectName]);

    if (latestSubmit[projectName] === undefined) {
      latestSubmit[projectName] = submit_object[i].date;
    } else {
      latestSubmit[projectName] < submit_object[i].date ? (latestSubmit[projectName] = submit_object[i].date) : null;
    }
  }

  let keys = Object.keys(latestSubmit);
  console.log(`total submit project = ${keys.length}`);
  for (let i = 0; i < keys.length; i++) {
    console.log(`${keys[i].padEnd(50, " ")} : ${latestSubmit[keys[i]].toISOString().replace("T", " ")}`);
  }
  // console.log(latestSubmit);
});
