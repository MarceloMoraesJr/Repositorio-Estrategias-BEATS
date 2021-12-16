const db_client = require('../dbconfig').db_client;
const fs = require('fs').promises;

module.exports = class request_services{
    static async insertAddRequest(author){
        try{
            const text = "INSERT INTO solicitacao (username, tipo_solicitacao)\
            VALUES ($1, 1) RETURNING nro_protocolo AS protocol_number,\
            estado AS state, data_solicitacao AS application_date, username AS author";
            const values = [author];

            const rowInserted = await db_client.query(text, values);

            return rowInserted.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async insertAddRequestForm(n_protocol, proposed_strategy){
        try{
            const data = JSON.stringify(proposed_strategy);
            await fs.writeFile(process.env.PATH_REQUEST + `${n_protocol}/form.json`, data);
        }   
        catch(err){
            console.log(err);
        }
    }



    static async getRequestByProtocolNumber(request_protocol_number){
        try{
            const text = "SELECT tipo_solicitacao AS type, estado AS state,\
            data_solicitacao AS application_date, username AS author,\
            administrador AS administrator, voto_admin AS admin_vote,\
            texto_rejeicao AS rejection_text\
            FROM solicitacao WHERE nro_protocolo = $1";
            const values = [request_protocol_number];

            const db_request = await db_client.query(text, values);

            if(db_request.rowCount === 0){
                return null;
            }

            return db_request.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }
}