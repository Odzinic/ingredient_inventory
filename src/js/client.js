$(document).ready(function () {

    // Query ingredient api to retrieve list of ingredients in database and populate dropdown menu
    $.ajax("/api/ingredients/")
        .done(function (data){
            for (let i=0;i<data.length;i++){
                console.log(data[i]);
                $('#dropdownValues').append(`<a class="dropdown-item" href="#">${data[i].items}</a>`);
            }

        })
    
});