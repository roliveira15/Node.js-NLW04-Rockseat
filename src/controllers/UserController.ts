import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

//Não é responsabilidade do controler fazer pesquisa em banco de dados
class UserController {

    // Request = receber 
    // response = enviar
    async create(request: Request, response: Response){
        
        const {name, email} = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        // if(!(await schema.isValid(request.body)) {
        //     return response.status(400).json({
        //         error: "Validation is failed"

        //     })
        // }
        try{
            await schema.validate(request.body, {abortEarly:false});
        } catch(err){
            throw new AppError(err);
    
        }

        const usersRepository = getCustomRepository(UsersRepository);
        //Select * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({ email});

        if(userAlreadyExists){
            throw new AppError("User already exists!");
        };

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save (user);

        return response.status(201).json(user);
    };
};

export { UserController };
