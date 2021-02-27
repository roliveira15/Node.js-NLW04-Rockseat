import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

//Não é responsabilidade do controler fazer pesquisa em banco de dados
class UserController {

    // Request = receber 
    // response = enviar
    async create(request: Request, response: Response){
        
        const {name, email} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        //Select * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({ email});

        if(userAlreadyExists){
            return response.status(400).json({
                error:"User already exists!",
            });
        };

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save (user);

        return response.json(user);
    };
};

export { UserController };
