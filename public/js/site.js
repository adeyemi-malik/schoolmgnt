const AppConfig = {
    "apiBaseUrl" : "http://localhost:4000"
}
const getCategories = async() =>
{
    let response = await fetch(AppConfig.apiBaseUrl+ '/categories');
    let categories = await response.json();
    let data = categories.map(function(cat)
    {
        return  {'id' : cat.ID, 'text' : cat.name};
    });
    $('#category-id').select2({
        data : data
    }).trigger('change');
}
$('#category-id').on('change', async function(element)
{
    let categoryid = document.querySelector('#category-id').value;
    let response = await fetch(AppConfig.apiBaseUrl+ '/classes/' + categoryid);
    let classes = await response.json();
    let data = classes.map(function(cls)
    {
        return  {'id' : cls.ID, 'text' : cls.classname};
    });
    document.querySelector('#class-id').innerHTML = '';
    $('#class-id').select2({
        data : data
    }).trigger('change');
});
getCategories();
