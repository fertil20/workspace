export class PersistentState {
    constructor(component, name, initialState) {
        this.component = component
        this.name = name
        this.component.state = JSON.parse(localStorage.getItem(this.name)) || initialState
    }

    setState(state) {
        this.component.setState(state)
        localStorage.setItem(this.name, JSON.stringify(state))
    }

    getState() {
        return this.component.state
    }
}