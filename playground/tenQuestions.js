
// fetches the JSON data.
document.addEventListener("DOMContentLoaded", function () {
    fetch('https://opentdb.com/api.php?amount=10')
        .then(res => res.json())
        .then(data => {
            // Assuming data.results is an array of questions
            data.results.forEach(item => {
                console.log(item);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});


//function to return the question to the