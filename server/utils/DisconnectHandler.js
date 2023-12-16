

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
    #data = new Map();

    addDisconnectEvent(callback, id, waitDuration, data){
        let timeout = setTimeout(callback, waitDuration)
        this.#events.set(id.toString(), timeout)
        this.#data.set(id.toString(), data)
    }

    removeDisconnectEvent(id){
        clearTimeout(this.#events.get(id.toString()))
        let data = this.#data.get(id.toString())
        this.#events.delete(id.toString())
        this.#data.delete(id.toString())
        return data
    }

    
}