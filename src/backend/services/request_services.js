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
            await fs.writeFile(process.env.PATH_REQUEST + `${n_protocol}.json`, data);
        }   
        catch(err){
            console.log(err);
        }
    }
}