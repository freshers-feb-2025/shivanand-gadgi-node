let person={
    name:"Shiva",
    age:23,
    greet:function(){
        console.log("Hello "+this.name);
    }
};

console.log(person.name);
console.log(person.age);
person.greet();

let person_name=({name})=>{
    console.log("Name:"+name);
};

person_name(person);