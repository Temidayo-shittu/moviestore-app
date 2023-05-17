const createTokenUser= (user)=>{
    return {
        name: user.name,
        userId: user._id,
        role: user.role,
        category: user.category
    }  
}

module.exports= createTokenUser