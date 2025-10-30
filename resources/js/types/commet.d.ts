import { User } from ".";

export type CommentTypes ={
comment:string
task_id:number
}

export interface CommentInterface{
    id:number;
    comment:string;
    date_created:string;
    user: User
}
