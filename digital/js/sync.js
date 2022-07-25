function Sync()
{
    this.start = function(){
        const DEBUG = false;

        var _t = this;
        var millis = new Date().getTime();
        var millisToNextSecond = 1000 - (millis - (Math.floor(millis/1000)*1000));

        setTimeout(function(){
            setInterval(function(){
                millis = new Date().getTime();
                _t.dispatchEvent(new CustomEvent("on_1s_tick", {"detail":{millis}}));
            }, 1000)
        }, millisToNextSecond);
    }


    //event listeners
    this.eventListeners = new Array();
    this.addEventListener = function(type, eventHandler)
    {
        this.eventListeners.push({type, eventHandler});
    }

    this.dispatchEvent = function(event)
    {
        for (var i = 0; i < this.eventListeners.length; i++)
            if (event.type == this.eventListeners[i].type)
                this.eventListeners[i].eventHandler(event);
    }
}