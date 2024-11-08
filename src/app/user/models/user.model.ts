export interface Role {
    id: number;
    nameRole: string;
  }
  
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    username: string;
    password: string;
    email: string;
    birthday: string;
    phoneNumber: string;
    dni: string;
    gender: string;
    ruc: string;
    currencyType: string;
    roles: Role[];
  }


  export class UserModel implements User {
    id = 0;
    firstName = '';
    lastName = '';
    address = '';
    username = '';
    password = '';
    email = '';
    birthday = '';
    phoneNumber = '';
    dni = '';
    gender = '';
    ruc = '';
    currencyType = '';
    roles: Role[] = 
    [
      {
        id: 0,
        nameRole: ''
      }
    ];
  
    constructor() {
    }
  }