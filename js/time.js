var Time = (function(){
    var get_system_time = function() {return Math.floor((new Date()).getTime() / 1000);};
    var start_time = get_system_time();
    var game_time = 0;
    var update = function() {game_time = get_system_time() - start_time;};
    return {t: function(){return game_time;}, update: update};
}());
