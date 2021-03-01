import { json, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUserRepository } from "../repositories/SurveyUserRepository";


class AnswerController { 


    // http://localhost:3333/answers/1?u=0aafa160-fd18-4b77-9aee-fc3cb4443b34
    /*
        ROUTER PARAMS => Parêmatros que compõe a rota 
        routes.get("/answers/:value")

        QUERY PARAMS => Busca, Paginação, não obrigatórios, vem sempre depois do ponto de interrogção "?"
        ?
        chave=valor
    */
    async execute(request: Request, response: Response) {
        const {value} = request.params;
        const {u} = request.query;


        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

        const surveyUser = await surveysUsersRepository.findOne({

                id:String(u),
        });
        
        if(!surveyUser) {
            throw new AppError("Survey User does not exists!")
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }


}

export { AnswerController }