import { json, Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepository";
import { SurveysUserRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {

    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;
        
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);
        
        const userAlreadyExists = await usersRepository.findOne({ email});
        if(!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists"
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        
        if(!survey) {
            return response.status(400).json({
                error: "Survey does not exists!"
            })
        }

        //Salvar as informações na tabela  surveysUser
        const surveyUser = surveysUsersRepository.create({

            user_id: userAlreadyExists.id,
            survey_id

        });

        await surveysUsersRepository.save(surveyUser);
        //Enviar e-mail para o usuário
        const npsPath = resolve(__dirname, "..", "views","emails","npsMail.hbs");

        await SendMailService.execute(email,survey.title,survey.description)


        return response.json(surveyUser);
    }

}

export { SendMailController }
