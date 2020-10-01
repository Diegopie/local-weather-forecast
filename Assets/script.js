// *  Global Variables
    // Use this to run updated AJAX reqeust
    let activeCity;
    // Blank object to contain local storage items
    let recCities = [];
    // Store current time
    let date = moment();
    // Contain data from current weather API
    let weathData = {
        temp: "",
        hum: "",
        wind: "",
        lat: "",
        lon: "",
        uv: "",
        icon: "",
    }

// * Functions

    // ** Checks Local Storage for Data, populates recCities array, and calls renderCities()
    function init() {
        // Parse Data In Local Storage
        let storedCities = JSON.parse(localStorage.getItem("cities"))
        // Check if Local Storage Was Empty
                // console.log(storedCities);
        if (storedCities !== null) {
            recCities = storedCities; 
        }
        // Display the current date if no city has been loaded
        $('#current-city').text(date.format('MMMM Do'));
        renderCities();
    }

    // ** Render recent cities from recCities object
    function renderCities () {
        // Removes all previous <li>s as to not render them twice
        $('#rec-search').html("")
        // Create HTML elements and send to DOM, then call checkList()
        for (let i = 0; i < recCities.length; i++) {
            var newCity = $('<li>')
            newCity.prepend($('<button>').addClass('btn btn-secondary').text(recCities[i]));
            $('#rec-search').prepend(newCity);
            // console.dir($('#rec-search').children()); 
            checkList();
        }       
    }

    // ** Splice out items in the array if more than 10 are displayed
    function checkList () {
        // Path to the <ul> and finding the children length
        let checker = $('#rec-search')[0].children.length;
        if (checker >= 11) {
            // console.log("Noice");
            recCities.splice(0,1);
        }
    }

    // ** Make AJAX Requests
    function weatherRequest(city, check) {
        // Create URLs and store in variable
        let curWea = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7";
        
        // *** Make AJAX Request for current weather
        $.ajax({
            url: curWea,
            method: "GET"
        }) .then (function current(curRespon) {
                    // console.log(curRespon);
                    // console.log(city);
            // Run pushCheck() to view
            pushCheck(city, check);
            // Store data in weathData object
            weathData.temp = Math.floor((curRespon.main.temp - 273.15) * 1.80 + 32);
            weathData.hum = curRespon.main.humidity;
            weathData.wind = curRespon.wind.speed;
            weathData.lat = curRespon.coord.lat;
            weathData.lon = curRespon.coord.lon;
            weathData.icon = "http://openweathermap.org/img/wn/" + curRespon.weather[0].icon + "@2x.png"
                    // console.log(weathData);
            // *** Make Ajax request for UV value ^note^ this can be referenced with the onecall API now, this call isnt necessary ^note^
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=d203ab0e9d06e58c82c3b764c42b7aa7&lat=" + weathData.lat + "&lon=" + weathData.lon,
                method: "GET"
            }) .then (function (uvRespon){
                // Store data in weathData object and run updateCurrent()
                        // console.log(uvRespon);
                weathData.uv = uvRespon.value;
                updateCurrent();
                // *** Make ajax request for 5 day forecast
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + weathData.lat + "&lon=" + weathData.lon + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7",
                    method: "GET"
                }) .then (function(fiResponce) {
                    // call updateFive() and pass through the ajax responce; call renderCities()
                            // console.log(fiResponce);
                    // Call updatedFive() with the data from the Ajax, call renderCities()
                    updateFive(fiResponce);
                    renderCities();
                });
            })
        });       
    }

    // ** Check if City Needs to be added to recCities array
    function pushCheck (city, check) {
        // If the request was submitted from recent searches button, don't add the city to the DOM
        if (check === 0) {
            return;
        } 
        // Add the value of city to recCities array
        recCities.push(city);
        // Send recCities array to local storage
        localStorage.setItem('cities', JSON.stringify(recCities));
    }

 
    // ** Update Content Day container DOM
    function updateCurrent() {
                // console.dir(document.querySelector('#temp'));
        $('#current-city').html("" + activeCity + ": " + "<span>" + date.format('MMM. Do') + "<span><img src='"+ weathData.icon + "'>" );
                // console.log(weathData.uv);
        $('#temp').text(weathData.temp + " °F");
        $('#hum').text(weathData.hum + "%");
        $('#wind').text(weathData.wind + " MPH");
        $('#uv').removeClass('yellow red green')
        if (weathData.uv < 3) {
            $('#uv').text(weathData.uv).addClass('green');
        } else if (weathData.uv >= 3 && weathData.uv < 8) {
            $('#uv').text(weathData.uv).addClass('yellow');
        } else if (weathData.uv > 8) {
            $('#uv').text(weathData.uv).addClass('red');
        }
        
    }
    // ** Update Five Day Forecast Container
    function updateFive(data) {
                // console.log(data);
                // console.dir($('.card-body'));
        // Run loop so that each day container is updated with the corresponding data
        for (let i = 1; i < 6; i++) {
            // This variable will store the path to current card to update
            let currCard = $('.card-body')[i].children;                
                // console.log($('.card-body')[i]);
                // this variable will store the data path to the corresponding day of the current card
                let currDay = data.daily[i];
                // console.log(currDay);
                // Reset to the current date
                date = moment();
                // Update card DOM with the appropriate data
                currCard[0].textContent = date.add(''+i+'', 'day').format('dddd');                
                currCard[1].setAttribute('src', "http://openweathermap.org/img/wn/" + currDay.weather[0].icon + "@2x.png");
                currCard[2].textContent = "Temperature: " + Math.floor((currDay.temp.day - 273.15) * 1.80 + 32);
                currCard[3].textContent = "Humidity: " + currDay.humidity; 
        } 
    }


// * Run When Page Loads To Update recCities with content in local storage, then call renderCities
    init();

// * Grab the value from user input; run weatherRequest()
    $('#search-btn').click(function(event){
        event.preventDefault();
        activeCity = $('#user-search').val().trim();
                // ^ Test paths and variable         
                // console.log($('#user-search').val());
                // console.log(activeCity);
                // console.log(recCities);        
        weatherRequest(activeCity, 1);   
    });

// * Grab Inner Text from Recent Search Buttons and call weatherRequest()
$('#rec-search').click(function(event){
        // console.log($(event.target).text());
    activeCity = $(event.target).text();
    weatherRequest(activeCity, 0);
})