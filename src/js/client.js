let tblIngredients = document.getElementById("tblEmpAllowances").getElementsByTagName('tbody')[0];
document.getElementById("menu1").style.visibility = "hidden";


function ingredRow(){
    let newRow = tblIngredients.insertRow(-1);
    let newCell = newRow.insertCell(0);
    newCell.innerText = "Hi";
}

$(document).ready(function () {

    // Query ingredient api to retrieve list of ingredients in database and populate dropdown menu
    $.ajax("/api/ingredients/")
        .done(function (data){
            for (let i=0;i<data.length;i++){
                $('#dropdownValues').append(`<a class="dropdown-item" href="#">${data[i].items}</a>`);
            }
            $('#btnSave').on("click", ingredRow);

        })

});