

// Using singleton pattern to avoid having to pass the same object to all sockets
export default (function (){
    var instance;

    function createInstance() {
        var object = new _DisconnectHandler
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };

})();


class _DisconnectHandler{
    #events = new Map();

    addDisconnectEvent(callback, id, waitDuration){
        let timeout = setTimeout(callback, waitDuration)
        this.#events.set(id.toString(), timeout)
    }

    removeDisconnectEvent(id){
        clearTimeout(this.#events.get(id.toString()))
    }
}