$(()=>{

    var times = {};
    $.getJSON('https://geolocation-db.com/json/',l=>{
        $.getJSON(`https://api.sunrise-sunset.org/json?lat=${l.latitude}&lng=${l.longitude}&formatted=0`,r=>{
            Object.keys(r.results).forEach(k=>times[k] = new Date(r.results[k]).getTime());
            setInterval(wallpaperUpdate,15e3);
            wallpaperUpdate();
        });
    });

    Number.prototype.between = function(min, max){
        return min <= this && this <= max;
    }

    Number.prototype.sinProgress = function(min, max){
        return -(Math.cos(Math.PI * ((this - min) / (max - min))) / 2) + .5;
    }

    function wallpaperUpdate(){
        var now = new Date().getTime();

        var sunsetOpacity = 0;
        if(now.between(times.astronomical_twilight_begin, times.nautical_twilight_begin)) sunsetOpacity = now.sinProgtimess(times.astronomical_twilight_begin, times.nautical_twilight_begin);
        else if(now.between(times.nautical_twilight_begin, times.nautical_twilight_end)) sunsetOpacity = 1;
        else if(now.between(times.nautical_twilight_end, times.astronomical_twilight_end)) sunsetOpacity = 1 - now.sinProgtimess(times.nautical_twilight_end, times.astronomical_twilight_end);

        var noonOpacity = 0;
        if(now.between(times.civil_twilight_begin, times.sunrise)) noonOpacity = now.sinProgtimess(times.civil_twilight_begin, times.sunrise);
        else if(now.between(times.sunrise, times.sunset)) noonOpacity = 1;
        else if(now.between(times.sunset, times.civil_twilight_end)) noonOpacity = 1 - now.sinProgtimess(times.sunset, times.civil_twilight_end);

        $('#sunset').css('opacity', sunsetOpacity);
        $('#noon').css('opacity', noonOpacity);
    }

});