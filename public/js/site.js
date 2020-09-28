const AppConfig = {
    "apiBaseUrl": ""//"http://localhost:4000"
}
const getCategories = async () => {
    let response = await fetch(AppConfig.apiBaseUrl + '/categories');
    let categories = await response.json();
    let data = categories.map(function (cat) {
        return { 'id': cat.ID, 'text': cat.name };
    });
    $('#category-id').select2({
        data: data
    }).trigger('change');
}
$('#category-id').on('change', async function (element) {
    let categoryid = document.querySelector('#category-id').value;
    let response = await fetch(AppConfig.apiBaseUrl + '/classes/' + categoryid);
    let classes = await response.json();
    let data = classes.map(function (cls) {
        return { 'id': cls.ID, 'text': cls.classname };
    });
    document.querySelector('#class-id').innerHTML = '';
    $('#class-id').select2({
        data: data
    }).trigger('change');
});
getCategories();


/*$("#loginform").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
        url: "/users/login",
        method: "post"
    }).done(d => {
        swal({
            /* title: "Good job!",
             text: "You clicked the button!",
             icon: "success",*/

// });
//});
//})



/*$(document).ready(function () {
    $("#submitbutton").submit(function () {

        Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success"

        });
    });
});*/
function congrats() {
    Swal.fire({
        title: "Congratulations!",
        text: "Your application has been submitted",
        icon: "success"

    });
}
$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tablerow tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

/*unction loginsuccessful() {
    Swal.fire({
        title: "Login successful!",

        icon: "success"

    });
}*/



/*$(document).ready(function () {

    ("#submitbutton").on('submit', function (e) { //also can use on submit
        e.preventDefault(); //prevent submit
        Swal.fire({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "Cancel",
            closeOnConfirm: true
        }
}).then(function (value) {
            if (value) {
                $('#applicationform').submit();
                Swal.fire({
                    title: "Congratulations!",
                    text: "Your application has been submitted",
                    icon: "success"

                });
            }
            else {
                Swal.fire({
                    title: "Sorry!",
                    text: "Your application was not submitted",
                    icon: "Error"

                });
            }
        });
});*/
