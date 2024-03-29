let tblIngredients = document.getElementById("tblEmpAllowances").getElementsByTagName('tbody')[0];
let ingredLst = "";
let recipeDict = {};
let idVal = 0;
let sampleAmount = 30;

// Nutrient data in database is in gram/kilogram
function updateAmnt(row, id, amount) {
    let nutrValues = recipeDict[id]["nutrientData"];

    // Update ingredient amount
    recipeDict[id]["amount"] = amount;

    // Update ingredient nutrient values
    recipeDict[id]["recipeValues"]["fat_cont"] = nutrValues["fat_cont"] * (amount / 100);
    recipeDict[id]["recipeValues"]["fibre_cont"] = nutrValues["fibre_cont"] * (amount / 100);
    recipeDict[id]["recipeValues"]["sugr_cont"] = nutrValues["sugr_cont"] * (amount / 100);
    recipeDict[id]["recipeValues"]["prot_cont"] = nutrValues["prot_cont"] * (amount / 100);
    recipeDict[id]["recipeValues"]["carb_cont"] = nutrValues["carb_cont"] * (amount / 100);
    recipeDict[id]["recipeValues"]["cost"] = nutrValues["cost"] * (amount / 100) //todo: insure the cost math is correct

    subTotals(parseFloat(row.cells[3].innerText), parseFloat(row.cells[4].innerText), parseFloat(row.cells[5].innerText), parseFloat(row.cells[6].innerText), parseFloat(row.cells[7].innerText), parseFloat(row.cells[8].innerText));

    // Update the page cells
    row.cells[2].innerText = ((amount / sampleAmount) * 100).toFixed(2);
    row.cells[3].innerText = recipeDict[id]["recipeValues"]["cost"].toFixed(2);
    row.cells[4].innerText = recipeDict[id]["recipeValues"]["fat_cont"].toFixed(2);
    row.cells[5].innerText = recipeDict[id]["recipeValues"]["fibre_cont"].toFixed(2);
    row.cells[6].innerText = recipeDict[id]["recipeValues"]["sugr_cont"].toFixed(2);
    row.cells[7].innerText = recipeDict[id]["recipeValues"]["prot_cont"].toFixed(2);
    row.cells[8].innerText = recipeDict[id]["recipeValues"]["carb_cont"].toFixed(2);

    addTotals(parseFloat(row.cells[3].innerText), parseFloat(row.cells[4].innerText), parseFloat(row.cells[5].innerText), parseFloat(row.cells[6].innerText), parseFloat(row.cells[7].innerText), parseFloat(row.cells[8].innerText));
}

function updateCont(row, drop, ingred, id = null) {

    // If loading from save, skip retrieval
    if (id == null){
        drop.text(`${ingred}`);
    }
    else{
        $.ajax(`/api/values?ingred=${ingred}`)
            .done(function (data) {
                // Add ingredient amount (1) and ingredient nutrient values (data[0])
                // recipeDict[id]= [1, data[0]];

                // amount: the amount of the ingredient in grams
                // nutrientData: JSON of ingredient nutrient data from database. Must be parsed to make a copy.
                // recipeValues: copy of nutrientData that will be manipulated based off entered amount
                recipeDict[id] = {"amount": 1, "nutrientData": JSON.parse(JSON.stringify(data[0])), "recipeValues": data[0], "ingredient":ingred};

                drop.text(`${ingred}`);
                //TODO: Makes these two cells change
                // row.cells[2].innerText = "100";
                // row.cells[3].innerText = "0";

            });
    }

}

function deleteRow(row, id = null) {

    if (id == null){
        row.remove();
    }

    else{
        row.remove();


        subTotals(recipeDict[id]["recipeValues"]["cost"], recipeDict[id]["recipeValues"]["fat_cont"], recipeDict[id]["recipeValues"]["fibre_cont"],recipeDict[id]["recipeValues"]["sugr_cont"],recipeDict[id]["recipeValues"]["prot_cont"],recipeDict[id]["recipeValues"]["carb_cont"]);
        delete recipeDict[id];
}

}

function ingredRow() {
    idVal++;

    // Add a new ingredient row
    let newRow = tblIngredients.insertRow(-1);

    // Add cells to ingredient row
    let dropdownCell = newRow.insertCell(0);
    let amntCell = newRow.insertCell(1);
    let perCell = newRow.insertCell(2);
    let costCell = newRow.insertCell(3);
    let fatCell = newRow.insertCell(4);
    let fibreCell = newRow.insertCell(5);
    let sugCell = newRow.insertCell(6);
    let protCell = newRow.insertCell(7);
    let carbCell = newRow.insertCell(8);
    let removeCell = newRow.insertCell(9);

    // Add bootstrap to cells
    $(dropdownCell).append(`<button class="btn btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select Ingredients</button><ul class="dropdown-menu"  id="dropdown_${idVal}" aria-labelledby="dropdownMenuButton"">${ingredLst}</ul>`);
    $(amntCell).append(`<div><input type="number" class="form-control" id="amnt_${idVal}" placeholder="Enter amount"></div>`);
    $(removeCell).append(`<button type="button" class="btn btn-danger" id="remove_${idVal}">Remove</button>`);


    // Add listeners to bootstrap cells //

    // Add on click listener to dropdown menus for selecting ingredient
    $(`#dropdown_${idVal} li`).on('click', function () {
        updateCont(newRow, $(this).parent().prev(), $(this).text(), $(this).parent()[0].id.split("_")[1])
    });

    // Add input listener for ingredient amount field
    amntCell.addEventListener('input', function () {
        updateAmnt(newRow, parseInt($(this).children()[0].children[0].id.split("_")[1]), $(this).children()[0].children[0].value)
    });

    // Add on click listener for remove row button
    $(`#remove_${idVal}`).on('click', function () {
        deleteRow(newRow, parseInt($(this)[0].id.split("_")[1]))
    });

    //TODO: Make percentages update when sample amount is adjusted
    $(`#sample-amount-form`).on('input', function(){sampleAmount = parseInt($(this)[0].value)});

}

function saveRecipe(){
    $('#cart').modal("show")
    $('#modalSave').on("click", function(){
        if ($('#modalRecipName').children()[1].value != ""){
            console.log("Submitting");
            let recname = $('#modalRecipName').children()[1].value;
            $.ajax({
                type: 'POST',
                url: 'api/saverecipes/',
                json: true,
                data: {recipName: recname, recipData: JSON.stringify(recipeDict)},
                success: function(){
                    console.log("Saving recipe");
                    $('#cart').modal("hide")
                },
                error: (function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                })
        });
        }
        else{
            alert("Please enter a recipe name first.");
        }

    })
}

function loadRecipe(id){
    idVal = 0;
    let recID = id.split("_")[1];
    console.log(recID)

    // Delete existing rows before loading
    for (let i = 0;i < tblIngredients.rows.length; i++){
        deleteRow(tblIngredients.rows[i]);
    }

    $.ajax({
        type: 'GET',
        url: '/api/loadrecipes/',
        data: {loadList: false, id: recID},
        success: function(data){
            recipeDict = JSON.parse(data[0]["RecipeData"]);
            i = 0;

            // Iterate through all of the ingredients in the recipe
            // Key is the key in the dict
            // i is used to specify the row being populated in the table
            for (var key in recipeDict){
                let ingredient = recipeDict[key]["ingredient"];
                let amount = recipeDict[key]["amount"];


                // Create row to load ingredient data into
                ingredRow();
                let currRow = tblIngredients.rows[i];
                let currDrop = currRow.cells[0].children[0];
                let currAmount = currRow.cells[1].children[0].children[0];

                // Update the row to have the appropriate ingredient name and saved amounts
                currDrop.textContent = ingredient;
                updateAmnt(currRow, key, amount);
                currAmount.setAttribute('value', amount);

                i++;

            }
            $('#loadrecipeModal').modal("hide");
        }
    })

}

function recipePopup(){
    $.ajax({
        type: 'GET',
        url: '/api/loadrecipes/',
        data: {loadList: true},
        success: function(data){
            for (let i=0; i<data.length; i++){
                let loadRow = document.getElementById("loadrecipeTable").insertRow(-1);
                loadRow.insertCell(0).append(`${data[i]["RecipeName"]}`);
                loadRow.insertCell(1).append(`${data[i]["LastModified"]}`);
                $(loadRow.insertCell(2)).append(`<button class="btn btn-success" id="load_${data[i]["RecipeID"]}">Load</button>`)
                    .on("click", function(){loadRecipe($(this).children()[0].id)});
            }
        }
    })

    $('#loadrecipeModal').modal("show");
    $('#loadrecipeTable').empty();
}

function addTotals(itemCost, itemFat, itemFibre, itemSugar, itemProt, itemCarb){
    let totalRow = $('#tblTotals').children();

    // Cost cell
    if (isNaN(itemCost)){}
    else totalRow[3].innerText = (parseFloat(totalRow[3].innerText) + itemCost).toFixed(2);

    // Fat cell
    if (isNaN(itemFat)){}
    else totalRow[4].innerText = (parseFloat(totalRow[4].innerText) + itemFat).toFixed(2);

    // Fibre cell
    if (isNaN(itemFibre)){}
    else totalRow[5].innerText = (parseFloat(totalRow[5].innerText) + itemFibre).toFixed(2);

    if (isNaN(itemSugar)){}
    // Sugar cell
    else totalRow[6].innerText = (parseFloat(totalRow[6].innerText) + itemSugar).toFixed(2);

    if (isNaN(itemProt)){}
    // Protein cell
    else totalRow[7].innerText = (parseFloat(totalRow[7].innerText) + itemProt).toFixed(2);

    if (isNaN(itemCarb)){}
    // Carbs cell
    else totalRow[8].innerText = (parseFloat(totalRow[8].innerText) + itemCarb).toFixed(2);

}

function subTotals(itemCost, itemFat, itemFibre, itemSugar, itemProt, itemCarb){
    let totalRow = $('#tblTotals').children();

    // Cost cell
    if (isNaN(itemCost)){}
    else totalRow[3].innerText = (parseFloat(totalRow[3].innerText) - itemCost).toFixed(2);

    // Fat cell
    if (isNaN(itemFat)){}
    else totalRow[4].innerText = (parseFloat(totalRow[4].innerText) - itemFat).toFixed(2);

    // Fibre cell
    if (isNaN(itemFibre)){}
    else totalRow[5].innerText = (parseFloat(totalRow[5].innerText) - itemFibre).toFixed(2);

    if (isNaN(itemSugar)){}
    // Sugar cell
    else totalRow[6].innerText = (parseFloat(totalRow[6].innerText) - itemSugar).toFixed(2);

    if (isNaN(itemProt)){}
    // Protein cell
    else totalRow[7].innerText = (parseFloat(totalRow[7].innerText) - itemProt).toFixed(2);

    if (isNaN(itemCarb)){}
    // Carbs cell
    else totalRow[8].innerText = (parseFloat(totalRow[8].innerText) - itemCarb).toFixed(2);

}

$(document).ready(function () {
    $.ajax("/api/ingredients/")
        .done(function (data) {
            for (let i = 0; i < data.length; i++) {
                ingredLst += `<li><a class="dropdown-item" href="#">${data[i].items}</a></li>`;
            }
            ingredRow();
        })

    $('#btnAdd').on("click", ingredRow);
    $("#btnSave").on("click", saveRecipe);
    $('#btnLoad').on("click", recipePopup);

})
