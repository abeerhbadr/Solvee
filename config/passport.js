//const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcryptjs");
const {QueryDB}=require("../db");





module.exports=function(passport){
    passport.use(
        new LocalStrategy({
            usernameField:"email"
        },
        (email,password,done)=>{
            //Match User
            QueryDB.query("select * from dbproject.user where email='"+email+"'",(err,user)=>{
                //console.log(user);
                if(err){console.log(err);}
                else{
                    if(!user[0]){
                        console.log("user not found");
                        return done(null,false,{message:"That E-mail Isn't Found"});
                    }
                    else{
                        console.log("user found");
                        const userPass=user[0].pass;
                        console.log("user id:  "+user[0].ID);
                        console.log(userPass);
                        bcrypt.compare(password,userPass,(err,isMatch)=>{
                            console.log(password);
                            if(err) console.log(err);
                            if(isMatch){
                                console.log("done");
                                return done(null,user[0]);
                            }else{
                                //console.log("undone");
                                return done(null,false,{message:"wrong password"});
                            }
                        });//end of compare
                    }
                }
            });
        }
        )
    );

    passport.serializeUser((user, done) =>{
        //console.log("serialize is started");
        done(null, user.ID);
        //console.log("serialize is done");
    });
      
    passport.deserializeUser((ID, done)=> {
        //console.log(ID);
        //console.log("deserialize is started");
        QueryDB.query('select * from dbproject.user where ID='+ID,(err,results)=>{
            if(err){console.log(err);}
            if(results[0]){
                done(null,results[0]);
                //console.log("deserialize is done");
            }
        });
        //console.log("deserialize is done");
    });

}