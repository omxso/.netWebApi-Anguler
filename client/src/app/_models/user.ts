export interface User { //when we use interface in TS we specify that somthing is a type of somthing 
    
    username: string;
    token: string;
    photoUrl:string;
    knownAs: string;
    gender : string;
    roles : string[];
}
