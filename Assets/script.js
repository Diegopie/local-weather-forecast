// *  Global Variables
    // Use this to run updated AJAX reqeust
    let activeCity;
    // Blank object to contain local storage items
    let recCities = [];


// * Functions

    // Checks Local Storage for Data, populates recCities, and calls renderCities
    function init() {
        // ** Parse Data In Local Storage
        let storedCities = JSON.parse(localStorage.getItem("cities"))
        // ** Check if Local Storage Was Empty
                console.log(storedCities);
        if (storedCities !== null) {
            recCities = storedCities; 
        }
        renderCities()
    }

    // Render Cities from recCities object
    function renderCities () {
        // Removes all previous <li>s as to not render them twice
        $('#rec-search').html("")
        // ** Create HTML elements and send to DOM
        for (let i = 0; i < recCities.length; i++) {
            var newCity = $('<li>');
            newCity.prepend($('<button>').addClass('btn btn-secondary').text(recCities[i]));
            $('#rec-search').prepend(newCity)
            // console.dir($('#rec-search').children());   
        }        
    }

    // Make AJAX Requests
    function weatherRequest(city) {
        // *** Create URLs and store in variable
        let curWea = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7"
        // let fiveWea = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7"
        // let uvWea = "https://api.openweathermap.org/data/2.5/uvi?appid=d203ab0e9d06e58c82c3b764c42b7aa7&lat=" + lat + "&lon=" + lon;

        // *** Make AJAX Request for current weather
        $.ajax({
            url: curWea,
            method: "GET"
        }) .then (function current(curResponce) {
            console.log(curResponce);
        })


    }


// * Run When Page Loads To Update recCities with content in local storage, then call renderCities
init();

// * Grab the value from user input; run function to append to ul; run function that gets AJAX request

$('#search-btn').click(function(event){
    event.preventDefault()
    activeCity = $('#user-search').val().trim()   
            // ^ Test paths and variable         
            console.log($('#user-search').val());
            console.log(activeCity);
    recCities.push(activeCity);
            console.log(recCities);
    localStorage.setItem('cities', JSON.stringify(recCities))
    renderCities()
    
    weatherRequest(activeCity);   
});


// * Function that appends <li> to Recent Searches and store in an array??
        // Keep that array in local storage, so that another funtion can load them in when the page runs? 
// function renderCities(city) {
//             console.log(city);
//     let newCity = $('<li>')
//     newCity.prepend($('<button>').addClass('btn btn-secondary').text(city));
//     $('#rec-search').prepend(newCity)
//     storedCities.push(city)
//             console.log(storedCities);
// }



// * Store cities in local storage
// function storeCity(city)

// * Function That Runs AJAX

