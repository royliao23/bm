export interface Todo {
    id: number;
    todo: string;
    isDone: boolean;
  }
export interface Author {
  name?:string; 
  age?:number;}
export interface Article {
  id: number;
  title: string;
  desc: string;
  year?: number;
  created_at?: string;
  author?:Author;
}
  