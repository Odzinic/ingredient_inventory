let tblIngredients = document.getElementById("tblEmpAllowances").getElementsByTagName('tbody')[0];
let ingredLst="";
let recipeDict = {};
let idVal =  0;

function updateAmnt(row){
}

function updateCont(row, drop, ingred, id){
    $.ajax(`/api/values?ingred=${ingred}`)
        .done(function (data){
            recipeDict[id] = data[0];
            drop.text(`${ingred}`);
            //TODO: Makes these two cells change
            row.cells[2].innerText = "100";
            row.cells[3].innerText = "0";

            row.cells[4].innerText = recipeDict[id]["fat_cont"];
            row.cells[5].innerText = recipeDict[id]["fibre_cont"];
            row.cells[6].innerText = recipeDict[id]["sugr_cont"];
            row.cells[7].innerText = recipeDict[id]["prot_cont"];
            row.cells[8].innerText = recipeDict[id]["carb_cont"];

    });



}

function ingredRow(){
    idVal++;

    let newRow = tblIngredients.insertRow(-1);
    let dropdownCell = newRow.insertCell(0);
    let amntCell = newRow.insertCell(1);
    let perCell = newRow.insertCell(2);
    let costCell = newRow.insertCell(3);
    let fatCell = newRow.insertCell(4);
    let fibreCell = newRow.insertCell(5);
    let sugCell = newRow.insertCell(6);
    let protCell = newRow.insertCell(7);
    let carbCell = newRow.insertCell(8);

    $(dropdownCell).append(`<button class="btn btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select Ingredients</button><ul class="dropdown-menu" id="dropdown_${idVal}" aria-labelledby="dropdownMenuButton"">${ingredLst}</ul>`);
    $(amntCell).append(`<div><input type="number" class="form-control" id="exampleInputEmail1" placeholder="Enter amount"></div>`);

    $(`#dropdown_${idVal} li`).on('click', function(){updateCont(newRow, $(this).parent().prev(), $(this).text(), idVal)});
    amntCell.addEventListener('input', function(){updateAmnt(newRow)});

}

$(document).ready(function () {
    $.ajax("/api/ingredients/")
        .done(function (data) {
            for (let i = 0; i < data.length; i++) {
                ingredLst += `<li><a class="dropdown-item" href="#">${data[i].items}</a></li>`;
            }
            ingredRow();
        })

    $('#btnSave').on("click", ingredRow);

})
