import axios, { AxiosPromise } from "axios";

interface HasId {
    id?: number;
}

export class ApiSync<T extends HasId> {
    constructor(public rootUrl: string) {}

    async fetch(id: number): AxiosPromise<T> {
        return axios.get<T>(`${this.rootUrl}/${id}`);
    }

    async save(data: T): AxiosPromise<T> {
        const { id } = data;

        if (id) {
            return axios.put<T>(`${this.rootUrl}/${id}`, data);
        } else {
            // post
            return axios.post<T>(`${this.rootUrl}`, data);
        }
    }
}
