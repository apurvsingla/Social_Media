// for preview
let openFile = function(event) {
    let input = event.target;

    let reader = new FileReader();
    reader.onload = function() {
        let dataURL = reader.result;
        let output = document.getElementById('output');
        output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
};

$('#cancel').click((e) => {
    e.preventDefault();
    $('#output').removeAttr('src');
    $('#file').val('');
})