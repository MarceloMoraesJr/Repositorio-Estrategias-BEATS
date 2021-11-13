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
