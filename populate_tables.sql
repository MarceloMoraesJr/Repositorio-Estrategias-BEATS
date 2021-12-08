INSERT INTO usuario (username, email, senha, perfil_github, tipo_usuario)
    VALUES ('Marcelo Moraes', 'marceloadmin@email.com', 'senha_teste', 'MarceloMoraesJr', 2);

INSERT INTO usuario (username, email, senha, perfil_github, tipo_usuario)
    VALUES ('Carlos Bife', 'carlosbife72@email.com', 'caminhao72', 'CarlosBife', 1);

INSERT INTO usuario (username, email, senha, perfil_github)
    VALUES ('Virginia Armstrong', 'virarmstrong@email.com', 'virg123', 'VirginiaArmstrong');

INSERT INTO usuario (username, email, senha, perfil_github)
    VALUES ('Roberto12', 'robertoDoze@email.com', 'r2d2', 'robervaldo_12');

INSERT INTO estrategia_arquitetural (nome, tipo, username_criador, c, authz, caminho_documentacao, caminho_imagens)
	VALUES ('Role-Based Access Control', 0,'Marcelo Moraes', TRUE, TRUE, 'role_based_access_control/data.json', 'role_based_access_control/imgs/');

INSERT INTO sinonimo_estrategia (estrategia, sinonimo)
    VALUES ('Role-Based Access Control', 'RBAC');

INSERT INTO estrategia_arquitetural (nome, tipo, username_criador, c, authz, caminho_documentacao, caminho_imagens)
	VALUES ('Attribute-Based Access Control', 0,'Marcelo Moraes', TRUE, TRUE, 'attribute_based_access_control/data.json', 'attribute_based_access_control/imgs/');

INSERT INTO sinonimo_estrategia (estrategia, sinonimo)
    VALUES ('Attribute-Based Access Control', 'ABAC');

INSERT INTO estrategia_arquitetural (nome, tipo, username_criador, c, authn, authz, caminho_documentacao, caminho_imagens)
	VALUES ('Checkpoint', 0,'Marcelo Moraes', TRUE, TRUE, TRUE, 'checkpoint/data.json', 'checkpoint/imgs/');

INSERT INTO sinonimo_estrategia (estrategia, sinonimo)
    VALUES ('Checkpoint', 'Access Verification');

INSERT INTO sinonimo_estrategia (estrategia, sinonimo)
    VALUES ('Checkpoint', 'Validation and Penalization');