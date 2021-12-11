const db_client = require('../dbconfig').db_client;

module.exports = class comment_services{
    static async getAllStrategyComments(strategy_name){
        try{
            const text = "SELECT b.id AS base_id, b.username AS base_user,\
            b.data_comentario AS base_date, b.texto AS base_text,\
            r.id AS reply_id, r.username AS reply_user,\
            r.data_comentario AS reply_date, r.texto AS reply_text\
            FROM comentario b\
            LEFT JOIN comentario r ON b.id = r.comentario_base\
            WHERE b.estrategia = $1 AND b.comentario_base IS NULL\
			ORDER BY base_date, reply_date";

            const values = [strategy_name];
            const db_comments = await db_client.query(text, values);

            let comments = {};

            db_comments.rows.forEach(comment => {
                if(comments[comment.base_id] === undefined){
                    comments[comment.base_id] = {
                        id: comment.base_id, 
                        author: comment.base_user, 
                        date: comment.base_date,
                        text: comment.base_text,
                        replies: []
                    };

                    if(comment.reply_id != null){
                        comments[comment.base_id].replies = [{
                            id: comment.reply_id, 
                            author: comment.reply_user, 
                            date: comment.reply_date,
                            text: comment.reply_text
                        }]
                    }
                } 
                else{
                    comments[comment.base_id].replies.push({
                        id: comment.reply_id, 
                        author: comment.reply_user, 
                        date: comment.reply_date,
                        text: comment.reply_text
                    });
                }
            });

            return Object.values(comments);

        }
        catch(err){
            console.log(err);
        }
    }



    static async getCommentById(strategy_name, id){
        try{
            const text = "SELECT id, c.username AS author, c.data_comentario AS date,\
            c.texto AS text, c.comentario_base AS base_comment\
            FROM comentario c\
            WHERE c.estrategia = $1 AND c.id = $2";
            
            const values = [strategy_name, id];

            const db_comment = await db_client.query(text, values);

            if(db_comment.rowCount === 0){
                return null;
            }
            
            return db_comment.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async getCommentReplies(id){
        try{
            const text = "SELECT c.id, c.username AS author, c.data_comentario AS date, c.texto AS text\
            FROM comentario c\
            WHERE c.comentario_base = $1\
            ORDER BY date";
            
            const values = [id];

            const db_replies = await db_client.query(text, values);

            return db_replies.rows;
        }
        catch(err){
            console.log(err);
        }
    }



    static async commentStrategy(strategy_name, author, comment_text){
        try{
            const text = "INSERT INTO comentario (username, estrategia, texto)\
            VALUES ($1, $2, $3)\
            RETURNING id, estrategia AS strategy, username AS author, data_comentario AS date, texto AS text";
            const values = [author, strategy_name, comment_text];
            
            const rowInserted = await db_client.query(text, values);

            return rowInserted.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async replyCommentStrategy(strategy_name, comment_base_id, author, reply_text){
        try{
            const text = "INSERT INTO comentario (username, estrategia, texto, comentario_base)\
            VALUES ($1, $2, $3, $4)\
            RETURNING id, estrategia AS strategy, username AS author, data_comentario AS date, texto AS text, comentario_base AS base_comment";
            const values = [author, strategy_name, reply_text, comment_base_id];

            const rowInserted = await db_client.query(text, values);

            return rowInserted.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async commentExists(id){
        try{
            const text = "SELECT id FROM comentario\
            WHERE id = $1";
            const values = [id];

            const db_comment = await db_client.query(text, values);

            return db_comment.rowCount > 0;
        }
        catch(err){
            console.log(err);
        }
    }



    static async deleteCommentById(id){
        try{
            const text = "DELETE FROM comentario\
            WHERE id = $1\
            RETURNING id, username AS author, estrategia AS strategy,\
            data_comentario AS date, texto AS text, comentario_base AS base_comment";
            const values = [id];

            const rowRemoved = await db_client.query(text, values);

            return rowRemoved.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }
}