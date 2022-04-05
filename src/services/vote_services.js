const db_client = require('../dbconfig').db_client;
const fs = require('fs').promises;

module.exports = class vote_services{
    static async insertAdminVoteOnRequest(n_protocol, admin, admin_vote, rejection_text){
        try{
            const text = "UPDATE solicitacao SET administrador = $1, voto_admin = $2,\
            texto_rejeicao = $3, estado = $4\
            WHERE nro_protocolo = $5\
            RETURNING nro_protocolo AS protocol_number, tipo_solicitacao AS type, estado AS state,\
            data_solicitacao AS application_date, username AS author";
            const values = [admin, admin_vote, rejection_text, admin_vote + 1, n_protocol];

            const request_voted = await db_client.query(text, values);

            return request_voted.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async createCouncilVoting(n_protocol, recurrence_number, record_path){
        
        await vote_services.createCouncilVotingRecord(n_protocol);

        try{
            const text = "INSERT INTO votacao_conselho\
            (nro_protocolo_solicitacao, nro_recorrencia, caminho_ata)\
            VALUES ($1, $2, $3) RETURNING nro_protocolo_solicitacao AS protocol_number,\
            nro_recorrencia AS recurrence_number, nro_aceitar AS accept_count,\
            nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count";
            const values = [n_protocol, recurrence_number, record_path];
            
            const created_councilVoting = await db_client.query(text, values);

            return created_councilVoting.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async createCouncilVotingRecord(n_protocol){
        const data = JSON.stringify({votes: []});

        await fs.writeFile(process.env.PATH_REQUEST + `${n_protocol}/record.json`, data);
    }



    static async insertVoteIntoCouncilRecord(n_protocol, vote_data){
        const recurrence_number = await vote_services.getCurrentCouncilVotingRecurrence(n_protocol);

        let data = await fs.readFile(process.env.PATH_REQUEST+ `${n_protocol}/record.json`);
            
        data = JSON.parse(data);
        data.votes.push(vote_data);
        data = JSON.stringify(data);
        
        await fs.writeFile(process.env.PATH_REQUEST + `${n_protocol}/record.json`, data);
    }



    static async getCurrentCouncilVotingRecurrence(n_protocol){
        try{
            const text = "SELECT * FROM votacao_conselho\
            WHERE nro_protocolo_solicitacao = $1"
            const values = [n_protocol];

            const db_recurrence_number = await db_client.query(text, values);

            return db_recurrence_number.rowCount;
        }
        catch(err){
            console.log(err);
        }
    }



    static async getCouncilVotingScore(n_protocol){
        try{
            const text = "SELECT nro_aceitar AS accept_count, nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count\
            FROM votacao_conselho\
            WHERE nro_protocolo_solicitacao = $1 AND nro_recorrencia = $2";
            const values = [n_protocol, await vote_services.getCurrentCouncilVotingRecurrence(n_protocol)];

            const db_voting_score = await db_client.query(text, values);

            return db_voting_score.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async insertCouncilMemberVote(n_protocol, council_member, vote){
        
        const recurrence_number = await vote_services.getCurrentCouncilVotingRecurrence(n_protocol);

        try{
            const text1 = "INSERT INTO voto (nro_protocolo_solicitacao, nro_recorrencia,\
            membro_conselho, voto_opcao)\
            VALUES($1, $2, $3, $4)";

            const values1 = [n_protocol, recurrence_number, council_member, vote];

            await db_client.query(text1, values1);

            const text2 = 
            "UPDATE votacao_conselho\
            SET nro_aceitar = nro_aceitar + $1,\
                nro_aceitar_com_sugestoes = nro_aceitar_com_sugestoes + $2,\
                nro_rejeitar = nro_rejeitar + $3\
            RETURNING nro_protocolo_solicitacao AS protocol_number, nro_recorrencia AS recurrence_number,\
            nro_aceitar AS accept_count, nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count";
            const values2 = [Number(vote === 0), Number(vote === 1), Number(vote === 2)];

            const db_council_voting = await db_client.query(text2, values2);

            return db_council_voting.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async hasCouncilMemberVoted(n_protocol, council_member){
        const recurrence_number = await vote_services.getCurrentCouncilVotingRecurrence(n_protocol);
        
        try{
            const text = "SELECT * FROM voto WHERE nro_protocolo_solicitacao = $1\
             AND nro_recorrencia = $2 AND membro_conselho = $3";
            const values = [n_protocol, recurrence_number, council_member];

            const db_vote = await db_client.query(text, values);

            return db_vote.rowCount > 0;
        }
        catch(err){
            console.log(err);
        }
    }
}