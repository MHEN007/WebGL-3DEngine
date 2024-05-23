class Updater{
    subscribers

    constructor()
    {
        this.subscribers = []
    }

    subscribe(item)
    {
        this.subscribers.push(item)
    }

    update(x = null)
    {
        for(let i = 0; i < this.subscribers.length; i++)
            {
                this.subscribers[i].update(x)
            }
    }
}