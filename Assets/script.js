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

    // Checks Local Storage for Data, populates recCities array, and calls renderCities()
    function init() {
        // ** Parse Data In Local Storage
        let storedCities = JSON.parse(localStorage.getItem("cities"))
        // ** Check if Local Storage Was Empty
                console.log(storedCities);
        if (storedCities !== null) {
            recCities = storedCities; 
        }
        $('#current-city').text(date.format('MMMM Do'));
        renderCities();
    }

    // Render Cities from recCities object
    function renderCities () {
        // Removes all previous <li>s as to not render them twice
        $('#rec-search').html("")
        // ** Create HTML elements and send to DOM
        for (let i = 0; i < recCities.length; i++) {
            var newCity = $('<li>')
            newCity.prepend($('<button>').addClass('btn btn-secondary').text(recCities[i]));
            $('#rec-search').prepend(newCity);
            // console.dir($('#rec-search').children()); 
            checkList();
        }       
    }

    // Make AJAX Requests
    function weatherRequest(city) {
        // *** Create URLs and store in variable
        let curWea = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7";
        
        // *** Make AJAX Request for current weather
        $.ajax({
            url: curWea,
            method: "GET"
        }) .then (function current(curRespon) {
            console.log(curRespon);
            weathData.temp = Math.floor((curRespon.main.temp - 273.15) * 1.80 + 32);
            weathData.hum = curRespon.main.humidity;
            weathData.wind = curRespon.wind.speed;
            weathData.lat = curRespon.coord.lat;
            weathData.lon = curRespon.coord.lon;
            weathData.icon = "http://openweathermap.org/img/wn/" + curRespon.weather[0].icon + "@2x.png"
            console.log(weathData);
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=d203ab0e9d06e58c82c3b764c42b7aa7&lat=" + weathData.lat + "&lon=" + weathData.lon,
                method: "GET"
            }) .then (function (uvRespon){
                console.log(uvRespon);
                weathData.uv = uvRespon.value;
                updateCurrent();

                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + weathData.lat + "&lon=" + weathData.lon + "&appid=d203ab0e9d06e58c82c3b764c42b7aa7",
                    method: "GET"
                }) .then (function(fiResponce) {
                    console.log(fiResponce);
                    updateFive(fiResponce);
                    renderCities();
                });
            })
        });       
    }


    // updateCurrent()
        // Update <h2> Content
    function updateCurrent() {
        console.dir(document.querySelector('#temp'));
        $('#current-city').html("" + activeCity + ": " + "<span>" + date.format('MMM. Do') + "<span><img src='"+ weathData.icon + "'>" );
        console.log(weathData.uv);
        $('#temp').text(weathData.temp + " °F");
        $('#hum').text(weathData.hum + "%");
        $('#wind').text(weathData.wind + " MPH");
        $('#uv').text(weathData.uv);
    }

    function updateFive(data) {
        console.log(data);
        console.dir($('.card-body'));
        for (let i = 1; i < 6; i++) {
            let currCard = $('.card-body')[i].children;
                // console.log(currCard[0].textContent);
                console.log($('.card-body')[i]);
                let currDay = data.daily[i];
                console.log(currDay);
                date = moment();
                currCard[0].textContent = date.add(''+i+'', 'day').format('dddd');
                // console.log(currDay.temp.day);
                currCard[1].setAttribute('src', "http://openweathermap.org/img/wn/" + currDay.weather[0].icon + "@2x.png");
                currCard[2].textContent = "Temperature: " + Math.floor((currDay.temp.day - 273.15) * 1.80 + 32);
                currCard[3].textContent = "Humidity: " + currDay.humidity; 
        } 
    }


// * Run When Page Loads To Update recCities with content in local storage, then call renderCities
init();

// * Grab the value from user input; run renderCities; run weatherRequest()
    // weatherReqest() runs updateCurrent() and updateFive()

$('#search-btn').click(function(event){
    event.preventDefault();
    activeCity = $('#user-search').val().trim();
            // ^ Test paths and variable         
            console.log($('#user-search').val());
            console.log(activeCity);
    recCities.push(activeCity);
            console.log(recCities);
    localStorage.setItem('cities', JSON.stringify(recCities));
    
    
    weatherRequest(activeCity);   
});

// * Grab Inner Text from Recent Search Buttons and make ajax request

$('#rec-search').click(function(event){
        console.log($(event.target).text());
    activeCity = $(event.target).text();
    weatherRequest(activeCity);
})

// Check the lenght of <ul> 


function checkList () {
    let checker = $('#rec-search')[0].children.length;

    if (checker >= 11) {
        console.log("Balls");
        recCities.splice(0,1);
    }

    }






