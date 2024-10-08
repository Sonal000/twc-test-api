const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

process.on('uncaughtException',err=>{
 console.log(err.name,err.message);
 console.log("UCAUGHT EXCEPTION! ...shutting down... ");
  process.exit(1);
});

const app = require('./app');
// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
// console.log(DB);

mongoose.connect(DB,{
 // useNewUrlParser: true,
 // useCreateIndex: true,
 // useFindandModify: false
}).then(()=>{
 console.log('Database connected suceessfully !');
})
.catch((err)=>{
 console.log(`Failed to connect to the database due to ${err}`);
}
);


const port= process.env.PORT || 3000;
const server=app.listen(port,()=>{
 console.log(`app is running on port :  ${port}`);
});

process.on('unhandledRejection',err=>{
 console.log(err.name,err.message);
 console.log("UNHANDLED REJECTION! ...shutting down... ");
 server.close(()=>{
  process.exit(1);
 })
});

