const jwt=require("jsonwebtoken");
const user={
    id:123,
    name:"Om",
    password:"12345",
};
const secretKey="mySecret";
const token=jwt.sign(user,secretKey,{expiresIn:'1h'});
console.log(token);
