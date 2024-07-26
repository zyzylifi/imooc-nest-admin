export class CreateMenuDto {
    id: number;
    path: string;
    name: string;
    redirect: string;
    meta: string;
    pid: number;
    active: number;
    data: any;
}
