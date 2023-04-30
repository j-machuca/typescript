export class Attributes<T extends {}> {
    constructor(private data: T) {}

    // Sets a generic constrait limiting the values of K to be keys included in the T interface
    // Returns the type of the Key in the interface T
    get = <K extends keyof T>(key: K): T[K] => {
        return this.data[key];
    };

    set(update: T): void {
        // assign<T extends {}, U>(target: T, source: U): T & U;
        Object.assign(this.data, update);
    }

    // set(update: T): void {
    //     this.data = { ...this.data, ...update };
    // }

    getAll(): T {
        return this.data;
    }
}
