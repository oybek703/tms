export interface User {
    id: number;
    userName: string;
    role: string;
    allowedPages: string;
    password?: string;
}
