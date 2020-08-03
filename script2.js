var apikey = "bc7a7a43e15f0895078920937ca5ab1f";
/*  $(document).ready(function() {
    alert("document loaded");
  });
*/
$("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();
    searchWeather(searchValue);

});

function searchWeather(searchValue) {
    if ($('uvi').length > 0) {
        var element = document.getElementById("uvi");
        element.parentNode.removeChild(element);
        var element = document.getElementById("forecast");
        element.parentNode.removeChild(element);
    }
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" +
            searchValue +
            "&appid=" +
            /* your API key here */
            apikey +
            "&units=imperial",
        dataType: "json",
        success: function (data) {
            /* lets get the forecast data */
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            $.ajax({
                type: "GET",
                url: "http://api.openweathermap.org/data/2.5/forecast?lat=" +
                    lat + "&lon=" + lon + "&appid=" +
                    /* your API key here */
                    apikey +
                    "&units=imperial",
                dataType: "json",
                success: function (fdata) {
                    var forecast = fdata
                    fiveday(forecast);
                }
            });
            $.ajax({
                type: "GET",
                url: "http://api.openweathermap.org/data/2.5/uvi?lat=" +
                    lat + "&lon=" + lon + "&appid=" +
                    /* your API key here */
                    apikey +
                    "&units=imperial",
                dataType: "json",
                success: function (uvi) {
                    var uv = uvi.value;
                    var uvi = document.createElement("uvi");
                    uvi.innerHTML = "UV Index is " + uv;
                    document.getElementById("weather-data").appendChild(uvi);
                }
            });
        }
    });
}

function fiveday(forecast) {
    var obj = [];
    var key;
    var dt;

    forecast.list.forEach(function (item) {
        dt = item.dt_txt;
        keys = dt.split(" ");
        key = keys[0];
        var arr = {
            "one": 1,
            "two": 2,
            "three": 3
        };
        if (!(key in obj)) {
            obj[key] = [];
            var temp = {
                'min': item.main.temp_min,
                'max': item.main.temp_max
            }
            obj[key] = temp;
        }
        if (item.main.temp_min < obj[key]['min']) {
            obj[key]['min'] = item.main.temp_min;
        }
        if (item.main.temp_max > obj[key]['max']) {
            obj[key]['max'] = item.main.temp_max;
        }
    });
    var forecast = document.createElement("forecast");
    var str = '';
    for (var prop in obj) {
        str = str + "<p>" + prop + "</p><p> low " + obj[prop]['min'] + "</p>" + "<p>" + " hi " + obj[prop]['max'] + "</p><br>";;
    }
    forecast.innerHTML = str;
    document.getElementById("weather-data").appendChild(forecast);
}