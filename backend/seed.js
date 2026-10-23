const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const cfg = {host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD||'',database:process.env.DB_NAME||'vitrinepro'};
const products = [
['Tênis','Tênis','NIKE','Tênis Esportivo Air',499.90,18,'40','Preto','Tênis esportivo fictício para demonstração.','👟',1],
['Tênis','Tênis','PUMA','Tênis Running Active',389.90,12,'41','Cinza','Tênis para corrida fictício.','👟',1],
['Tênis','Tênis','ADIDAS','Tênis Performance Run',429.90,20,'40','Branco','Tênis esportivo fictício.','👟',1],
['Tênis','Tênis','NEW BALANCE','Tênis Comfort 574',459.90,9,'42','Azul','Tênis casual fictício.','👟',1],
['Tênis','Tênis','CALVIN KLEIN','Tênis Urban Classic',519.90,7,'41','Branco','Tênis casual fictício.','👟',1],
['Calça','Calça','NIKE','Calça Sports Essential',279.90,15,'M','Preto','Calça esportiva fictícia.','👖',2],
['Calça','Calça','PUMA','Calça Active Training',239.90,11,'G','Cinza','Calça esportiva fictícia.','👖',2],
['Calça','Calça','ADIDAS','Calça Performance Basic',259.90,16,'M','Preto','Calça esportiva fictícia.','👖',2],
['Calça','Calça','NEW BALANCE','Calça Comfort Fit',289.90,8,'G','Marinho','Calça casual fictícia.','👖',2],
['Calça','Calça','CALVIN KLEIN','Calça Jeans Classic',349.90,6,'42','Azul','Calça jeans fictícia.','👖',2],
['Shorts','Shorts','NIKE','Shorts Dri-Fit Sport',159.90,24,'M','Preto','Shorts esportivo fictício.','🩳',1],
['Shorts','Shorts','PUMA','Shorts Active Run',139.90,19,'G','Azul','Shorts esportivo fictício.','🩳',1],
['Shorts','Shorts','ADIDAS','Shorts Training Basic',149.90,22,'M','Cinza','Shorts esportivo fictício.','🩳',1],
['Shorts','Shorts','NEW BALANCE','Shorts Performance',169.90,13,'G','Preto','Shorts esportivo fictício.','🩳',1],
['Shorts','Shorts','CALVIN KLEIN','Shorts Casual Essential',199.90,10,'M','Bege','Shorts casual fictício.','🩳',1],
['Camisa','Camisa','NIKE','Camisa Sports Basic',179.90,30,'M','Branca','Camisa esportiva fictícia.','👕',2],
['Camisa','Camisa','PUMA','Camisa Active Training',159.90,25,'G','Preta','Camisa esportiva fictícia.','👕',2],
['Camisa','Camisa','ADIDAS','Camisa Performance',169.90,27,'M','Azul','Camisa esportiva fictícia.','👕',2],
['Camisa','Camisa','NEW BALANCE','Camisa Running Comfort',189.90,14,'G','Cinza','Camisa esportiva fictícia.','👕',2],
['Camisa','Camisa','CALVIN KLEIN','Camisa Cotton Classic',229.90,12,'M','Branca','Camisa casual fictícia.','👕',2],
['Blusa','Blusa','NIKE','Blusa Sports Fleece',299.90,17,'M','Preta','Blusa de frio esportiva fictícia.','🧥',1],
['Blusa','Blusa','PUMA','Blusa Essential Hoodie',279.90,13,'G','Cinza','Blusa esportiva fictícia.','🧥',1],
['Blusa','Blusa','ADIDAS','Blusa Training Fleece',289.90,16,'M','Marinho','Blusa esportiva fictícia.','🧥',1],
['Blusa','Blusa','NEW BALANCE','Blusa Comfort Warm',319.90,9,'G','Verde','Blusa casual fictícia.','🧥',1],
['Blusa','Blusa','CALVIN KLEIN','Blusa Urban Premium',399.90,6,'M','Preta','Blusa casual fictícia.','🧥',1],
['Meia','Meia','NIKE','Meia Sports Crew',49.90,45,'39-42','Branca','Meia esportiva fictícia.','🧦',2],
['Meia','Meia','PUMA','Meia Active Comfort',39.90,38,'39-42','Preta','Meia esportiva fictícia.','🧦',2],
['Meia','Meia','ADIDAS','Meia Performance Basic',44.90,42,'39-42','Branca','Meia esportiva fictícia.','🧦',2],
['Meia','Meia','NEW BALANCE','Meia Running Comfort',54.90,29,'40-43','Cinza','Meia esportiva fictícia.','🧦',2],
['Meia','Meia','CALVIN KLEIN','Meia Cotton Essential',69.90,21,'39-42','Preta','Meia casual fictícia.','🧦',2],
['Boné','Boné','NIKE','Boné Sports Classic',119.90,18,'Único','Preto','Boné esportivo fictício.','🧢',1],
['Boné','Boné','PUMA','Boné Active Cap',99.90,15,'Único','Azul','Boné esportivo fictício.','🧢',1],
['Boné','Boné','ADIDAS','Boné Performance Cap',109.90,20,'Único','Branco','Boné esportivo fictício.','🧢',1],
['Boné','Boné','NEW BALANCE','Boné Running Classic',129.90,11,'Único','Cinza','Boné esportivo fictício.','🧢',1],
['Boné','Boné','CALVIN KLEIN','Boné Urban Essential',159.90,8,'Único','Preto','Boné casual fictício.','🧢',1]
];
(async()=>{
 const db=await mysql.createConnection(cfg);
 const hash=await bcrypt.hash('123456',10);
 await db.query("INSERT IGNORE INTO usuarios (id,nome,email,senha_hash,telefone,cidade,estado,tipo) VALUES (1,'João Silva','joao.cliente@vitrinepro.com',?,?,?,?, 'cliente'),(2,'Mariana Oliveira','mariana.cliente@vitrinepro.com',?,?,?,?, 'cliente'),(3,'Carlos Mendes','carlos.fornecedor@vitrinepro.com',?,?,?,?, 'fornecedor'),(4,'Fernanda Costa','fernanda.fornecedor@vitrinepro.com',?,?,?,?, 'fornecedor'),(5,'Administrador Vitrine Pro','admin@vitrinepro.com',?,?,?,?, 'admin')",[hash,'(12) 99999-1001','Jacareí','SP',hash,'(12) 99999-1002','São José dos Campos','SP',hash,'(12) 98888-2001','Jacareí','SP',hash,'(12) 98888-2002','São José dos Campos','SP',hash,'','','']);
 await db.query("INSERT IGNORE INTO fornecedores (id,usuario_id,empresa,responsavel,cnpj,endereco,cidade,estado,descricao) VALUES (1,3,'Vitrine Sports Distribuidora','Carlos Mendes','12.345.678/0001-90','Av. Principal, 100 - Centro','Jacareí','SP','Distribuidora de produtos esportivos para demonstração.'),(2,4,'Moda & Esporte Distribuidora','Fernanda Costa','98.765.432/0001-10','Rua das Flores, 250 - Centro','São José dos Campos','SP','Fornecedor de moda e produtos esportivos para demonstração.')");
 const [count]=await db.query('SELECT COUNT(*) c FROM produtos');
 if(count[0].c===0){for(const p of products) await db.query('INSERT INTO produtos (nome,categoria,marca,modelo,preco,estoque,tamanho,cor,descricao,emoji,fornecedor_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)',p);}
 console.log('Banco Vitrine Pro inicializado.'); await db.end();
})().catch(e=>{console.error(e);process.exit(1)});
