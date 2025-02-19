/*let convertToArray=function(args1,args2,args3){
    return [args1,args2,args3];
}*/

//console.log(convertToArray(2,3,4));
//So this one above is not flexible

let fruits=["Apple","Banana","Watermelon"];

let convertToArrayFlexible=[...fruits];//spread
console.log(convertToArrayFlexible);

let convertToArray=function merge(...args){
    return args;
}
console.log(convertToArray("Shiva",1,2,3,"John"));

pers