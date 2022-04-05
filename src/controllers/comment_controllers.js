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
        if(replies.length > 0 || comment.base_comment === null){
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

        const comment_inserted = await comment_services.commentStrategy(strategy_name, req.user_info.username, req.body.text);
        return res.status(201).send({message: 'success: comment inserted', comment: comment_inserted});
    }



    static async postReplyComment(req, res, next){
        const strategy_name = req.params.name;
        let base_comment_id = req.params.id;

        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regex.test(base_comment_id)){
            return res.status(400).send({error_message: 'base comment id is not in UUID format'});
        }

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        const base_comment = await comment_services.getCommentById(strategy_name, base_comment_id);
        if(!base_comment){
            return res.status(404).send({error_message: `base comment does not exist`});
        }

        if(base_comment.base_comment != null){
            base_comment_id = base_comment.base_comment;
        }

        const reply_inserted = await comment_services.replyCommentStrategy(strategy_name, base_comment_id, req.user_info.username, req.body.text);
        return res.status(201).send({message: 'success: comment inserted', comment: reply_inserted});
    }



    static async deleteComment(req, res, next){
        const strategy_name = req.params.name;
        const comment_id = req.params.id;
        const user = req.user_info;
        
        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regex.test(comment_id)){
            return res.status(400).send({error_message: 'comment id is not in UUID format'});
        }

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        const comment = await comment_services.getCommentById(strategy_name, comment_id);
        if(!comment){
            return res.status(404).send({error_message: 'comment does not exist'});
        }

        if(user.username != comment.author && user.user_type != 2){
            return res.status(403).send({error_message: "not allowed to remove another user's comment"});
        }
        
        const replies = await comment_services.getCommentReplies(comment_id);
        let comment_deleted = await comment_services.deleteCommentById(comment_id);
        if(replies.length > 0 || comment_deleted.base_comment === null){
            comment_deleted = {
                id: comment_deleted.id, 
                author: comment_deleted.author, 
                date: comment_deleted.date, 
                text: comment_deleted.text, 
                replies
            };
        }

        return res.status(200).send({message: 'success: comment deleted', comment: comment_deleted});
    }



    static async editComment(req, res, next){
        const strategy_name = req.params.name;
        const comment_id = req.params.id;
        const user = req.user_info;
        
        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regex.test(comment_id)){
            return res.status(400).send({error_message: 'comment id is not in UUID format'});
        }

        if(!await strategy_services.strategyExists(strategy_name)){
            return res.status(404).send({error_message: `strategy '${strategy_name}' does not exist`});
        }

        const comment = await comment_services.getCommentById(strategy_name, comment_id);
        if(!comment){
            return res.status(404).send({error_message: 'comment does not exist'});
        }

        if(user.username != comment.author){
            return res.status(403).send({error_message: "not allowed to edit another user's comment"});
        }

        const comment_edited = await comment_services.updateCommentText(comment_id, req.body.text);
        return res.status(200).send({message: 'success: comment updated', comment_edited})
    }
}