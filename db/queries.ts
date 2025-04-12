import prisma from '../prisma/prisma'

export const searchUsername = async (username:string) => {
    return await prisma.user.findUnique({
        where: {
            username:username,
        }
    });
};
export const searchUserById = async (id:number) =>{
    return await prisma.user.findUnique({
        where:{
            id:id
        }
    });
};
/*export const authenticateUser = async (username:string , password:string, done:Function) =>
{
    try{
        const user = await searchUsername(username);

        if(!user)
        {
            return done(null,false, {message: "No user with that username"});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return done(null,false,{message:"Incorrect password"});
        }

        return done(null,user);
    }
    catch(err)
    {
        console.error("Authentication error:",err);
        return done(err);
    }
}*/