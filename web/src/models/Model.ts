import { AxiosPromise } from "axios";

interface ModelAttributes<T> {
    set(value: T): void;
    getAll(): T;
    get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;
}

interface Events {
    on(eventName: string, callback: () => void): void;
    trigger(eventName: string): void;
}

export interface HasId {
    id?: number;
}

export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) {}

    // explicit getters

    // get on() {
    //     return this.events.on;
    // }

    // get trigger() {
    //     return this.events.trigger;
    // }

    // get get() {
    //     // Binding this instead of using arrow function
    //     // return this.attributes.get.bind(this.attributes);
    //     return this.attributes.get;
    // }

    // implicit getter
    // May cause issues if properties of object are not initialized as params in the constructor

    on = this.events.on;
    trigger = this.events.trigger;
    get = this.attributes.get;

    //

    set(update: T): void {
        this.attributes.set(update);
        this.events.trigger("change");
    }

    async fetch(): Promise<void> {
        const id = this.attributes.get("id");
        if (typeof id !== "number") {
            throw new Error("Cannot fetch without id");
        }
        const response = await this.sync.fetch(id);

        // We could access set function inside the attributes class
        // this will not trigger the change event
        // this.attributes.set(response.data)

        // By accessing the set inside user we will trigger the change event
        this.set(response.data);
    }

    async save(): Promise<void> {
        try {
            await this.sync.save(this.attributes.getAll());
            this.trigger("save");
        } catch {
            this.trigger("error");
        }
    }
}
