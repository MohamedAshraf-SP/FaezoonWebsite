export const getTypes= async (req, res)=>{
    try{
    
       
        const douas = await Doua.find().populate().select({_id:0,type:1})
        
        if(douas){
            const typesArray =[ ...new Set(douas.map(doua => doua.type))]  
            
            
            res.status(200).send(typesArray)
        }else{
            res.status(400).json("there are no types")
        }
    }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }