CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/*===USUARIO===*/
CREATE TABLE usuario(
    username VARCHAR (50) PRIMARY KEY,
    email VARCHAR (100) UNIQUE NOT NULL,
    senha CHAR (12) NOT NULL,
    perfil_github VARCHAR (100) UNIQUE NOT NULL,
    data_ingresso TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_usuario SMALLINT NOT NULL DEFAULT 0,                                   /*0: Usuario Comum, 1: Membro Conselho, 2: Administrador*/
    status_ativo BOOLEAN NOT NULL DEFAULT TRUE
);


/*===ESTRATEGIA_ARQUITETURAL===*/
CREATE TABLE estrategia_arquitetural(
	nome VARCHAR (100) PRIMARY KEY,
	tipo SMALLINT NOT NULL,                     /*0: padrao, 1: tatica*/
	
    C BOOLEAN NOT NULL DEFAULT FALSE,           /*Confidentiality*/
    I BOOLEAN NOT NULL DEFAULT FALSE,           /*Integrity*/
    A BOOLEAN NOT NULL DEFAULT FALSE,           /*Availability*/
    AuthN BOOLEAN NOT NULL DEFAULT FALSE,       /*Authentication*/
    AuthZ BOOLEAN NOT NULL DEFAULT FALSE,       /*Authorization*/
    Acc BOOLEAN NOT NULL DEFAULT FALSE,         /*Accountability*/
    NR BOOLEAN NOT NULL DEFAULT FALSE,          /*Non-repudiation*/

    username_criador VARCHAR (50), 
    FOREIGN KEY (username_criador)
        REFERENCES usuario (username) ON DELETE CASCADE,

    data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    caminho_documentacao VARCHAR (255) NOT NULL,
    caminho_imagens VARCHAR (255) NOT NULL
);


/*===SINONIMO_ESTRATEGIA===*/
CREATE TABLE sinonimo_estrategia(
    estrategia VARCHAR (100),
    FOREIGN KEY (estrategia)
        REFERENCES estrategia_arquitetural (nome) ON DELETE CASCADE,
    
    sinonimo VARCHAR (100) NOT NULL,

    PRIMARY KEY (estrategia, sinonimo)
);


/*===EDICAO===*/
CREATE TABLE edicao(
    administrador VARCHAR (50),
    FOREIGN KEY (administrador)
        REFERENCES usuario (username) ON DELETE CASCADE,
    
    estrategia VARCHAR (100),
    FOREIGN KEY (estrategia)
        REFERENCES estrategia_arquitetural (nome) ON DELETE CASCADE,

    data_edicao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (administrador, estrategia, data_edicao)
);


/*===COMENTARIO===*/
CREATE TABLE comentario(
    username VARCHAR (50),
    FOREIGN KEY (username)
        REFERENCES usuario (username) ON DELETE CASCADE,
    
    estrategia VARCHAR (100),
    FOREIGN KEY (estrategia)
        REFERENCES estrategia_arquitetural (nome) ON DELETE CASCADE,

    data_comentario TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (username, estrategia, data_comentario),

    texto VARCHAR (280),

    username_base VARCHAR (50),
    estrategia_base VARCHAR (100),
    data_base TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username_base, estrategia_base, data_base)
        REFERENCES comentario (username, estrategia, data_comentario)
);


/*===SOLICITACAO===*/
CREATE TABLE solicitacao(
    username VARCHAR (50),
    FOREIGN KEY (username)
        REFERENCES usuario (username) ON DELETE CASCADE,

    data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (username, data_solicitacao),

    tipo_solicitacao SMALLINT NOT NULL,                                 /*0: edicao, 1:adicao*/
    nro_protocolo UUID UNIQUE NOT NULL DEFAULT UUID_GENERATE_V4(),
    estado SMALLINT NOT NULL DEFAULT 0,                                 /*0 (Comum): voto administrador pendente*/

    administrador VARCHAR (50),
    FOREIGN KEY (administrador)
        REFERENCES usuario (username) ON DELETE CASCADE,
    
    voto_admin BOOLEAN,                                                 /*NULL: pendente, FALSE: rejeitar, TRUE: aceitar*/
    texto_rejeicao VARCHAR (500), 
    texto_edicao VARCHAR (500),

    estrategia_referente VARCHAR (100),
    FOREIGN KEY (estrategia_referente)
        REFERENCES estrategia_arquitetural (nome) ON DELETE CASCADE
);


/*===VOTACAO_CONSELHO===*/
CREATE TABLE votacao_conselho(
    username_solicitacao VARCHAR(50),
    data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username_solicitacao, data_solicitacao)
        REFERENCES solicitacao (username, data_solicitacao) ON DELETE CASCADE,
    
    nro_recorrencia SMALLINT NOT NULL DEFAULT 1,

    PRIMARY KEY (username_solicitacao, data_solicitacao, nro_recorrencia),
    
    nro_aceitar SMALLINT NOT NULL DEFAULT 0,
    nro_aceitar_com_sugestoes SMALLINT NOT NULL DEFAULT 0,
    nro_rejeitar SMALLINT NOT NULL DEFAULT 0,

    caminho_ata VARCHAR (255) NOT NULL
);


/*===VOTO===*/
CREATE TABLE voto(
    username_solicitacao VARCHAR (50),
    data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nro_recorrencia SMALLINT NOT NULL DEFAULT 0,
    FOREIGN KEY (username_solicitacao, data_solicitacao, nro_recorrencia)
        REFERENCES votacao_conselho (username_solicitacao, data_solicitacao, nro_recorrencia),
    
    membro_conselho VARCHAR (50),
    FOREIGN KEY (membro_conselho)
        REFERENCES usuario (username) ON DELETE CASCADE,

    PRIMARY KEY (username_solicitacao, data_solicitacao, nro_recorrencia, membro_conselho),

    voto_opcao SMALLINT NOT NULL   /*0: aceitar, 1: aceitar com sugestoes, 2: rejeitar*/
);