let empList = [];
const pageNumber = 1;
const limit = 5;
fetch(`http://localhost:4000/getEmpList/${pageNumber}/${limit}`)
  .then((response) => response.json())
  .then((response) => {
    empList = response.data;
    console.log(empList);
    // return res.render("adminPage.ejs", { empList: empList, limit: 5 });
    window.location.reload();
  })
  .catch((err) => {
    console.error("Error in calling api: " + err);
    return res.render("home.ejs");
  });
