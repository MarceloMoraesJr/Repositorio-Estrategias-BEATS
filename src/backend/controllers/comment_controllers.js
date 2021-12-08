const strategy_services = require("../services/strategy_services");
const comment_services = require("../services/comment_services");

module.exports = class comment_controllers{
    static async getComment(req, res, next){
        const strategy_name = req.params.name;
        const comment_id = req.params.id;

        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regex.test(comment_id)){
            return res.status(400).send({error_message: 'comment id is not in UUID format'});
        }

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy ${strategy_name} does not exist`});
        }

        const comment = await comment_services.getCommentById(strategy_name, comment_id);
        if(!comment){
            return res.status(404).send({error_message: 'this comment does not exist for this strategy'});
        }

        const replies = await comment_services.getCommentReplies(comment_id);
        if(replies.length > 0){
            return res.status(200).send({id: comment.id, author: comment.author, date: comment.date, text: comment.text, replies});
        }

        return res.status(200).send(comment);
    }



    static async getComments(req, res, next){
        const strategy_name = req.params.name;

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        return res.status(200).send({comments: await comment_services.getAllStrategyComments(strategy_name)});
    }



    static async postComment(req, res, next){
        const strategy_name = req.params.name;

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        const comment_inserted = await comment_services.commentStrategy(strategy_name, req.body.author, req.body.text);
        return res.status(201).send({message: 'success: comment inserted', comment: comment_inserted});
    }



    static async postReplyComment(req, res, next){
        const strategy_name = req.params.name;
        const comment_base_id = req.params.id;

        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regex.test(comment_base_id)){
            return res.status(400).send({error_message: 'comment base id is not in UUID format'});
        }

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        if(!await comment_services.commentExists(comment_base_id)){
            return res.status(404).send({error_message: `comment base does not exist`});
        }

        const reply_inserted = await comment_services.replyCommentStrategy(strategy_name, comment_base_id, req.body.author, req.body.text);
        return res.status(201).send({message: 'success: comment inserted', comment: reply_inserted});
    }
}