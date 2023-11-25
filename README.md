# Leaflet-Zen

Bem-vindo ao Leaflet-Zen, um aplicativo que utiliza a biblioteca Leaflet para interações intuitivas com mapas. Este projeto é desenvolvido utilizando as seguintes tecnologias:

[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Json-Server](https://img.shields.io/badge/-Json--Server-000000?logo=json&logoColor=white)](https://github.com/typicode/json-server)
[![SCRUM](https://img.shields.io/badge/-SCRUM-95BF47?logo=scrum-alliance&logoColor=white)](https://www.scrum.org/resources/what-is-scrum)
[![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Axios](https://img.shields.io/badge/-Axios-61DAFB?logo=axios&logoColor=white)](https://axios-http.com/)


https://github.com/GabFiterman/leaflet-zen/assets/94033226/ce30a530-2e78-44fe-b431-899b20ef6809



## Instruções de Download e Execução

> #### Nota: Certifique-se de estar utilizando o Node.js versão 18.

1. Clone o repositório:

   ```bash
   git clone https://github.com/GabFiterman/leaflet-zen.git
   cd leaflet-zen

2. Instale as dependências:

   ```bash
   npm install

3. Inicie o servidor JSON (simula uma API) na porta 3001:

   ```bash
   npm run backend

4. Inicie o aplicativo React:

   ```bash
   npm run frontend

5. Para corrigir problemas de formatação com Prettier (opcional)

   ```bash
   npm run format

-------------------------------------
# Funcionalidades do Projeto
> Para acompanhar melhor o processo de desenvolvimento do projeto e contribuir com uma documentação mais rica, todas as PR's estão devidamente documentadas, então não deixe de conferir:

> O projeto também contou com uma projetada organização de features utilizando Kanban, que pode ser acompanhada em meu [Board no Github](https://github.com/users/GabFiterman/projects/5/views/1)

### [PR 1: Initial Config](https://github.com/GabFiterman/leaflet-zen/pull/4)
Configurações gerais para iniciar o projeto, com destaque para:

Tailwind
TypeScript
Redux
EsLint
Prettier

### [PR 2: JSON-Server](https://github.com/GabFiterman/leaflet-zen/pull/5)
Melhorias na configuração do projeto, integração do json-server para simular uma API RESTful, e aprimoramentos no gerenciamento de dados.

### [PR 3: Index Map](https://github.com/GabFiterman/leaflet-zen/pull/6)
Desenvolvimento de um formulário para configurar latitude, longitude e zoom iniciais, atualização dos inputs em tempo real, e implementação do botão de salvar configuração inicial.

### [PR 4: Atomic Design](https://github.com/GabFiterman/leaflet-zen/pull/10)
Refatoração dos componentes para seguir o Design Pattern "Atomic Design" e criação de um Hook Personalizado para lidar com a alteração dos inputs.

### [PR 5: Sidebar + Interest Point](https://github.com/GabFiterman/leaflet-zen/pull/11)
Adição de uma barra lateral com botões dedicados para retornar à posição inicial e entrar no modo de adicionar ponto de interesse. Nova funcionalidade de ponto de interesse com marcador no mapa.

### [PR 6: Areas de Interesse](https://github.com/GabFiterman/leaflet-zen/pull/12)
Introdução da funcionalidade de criar áreas de interesse no mapa, permitindo desenho direto ou entrada de coordenadas.

### [PR 7: Perímetros](https://github.com/GabFiterman/leaflet-zen/pull/13)
Adição da funcionalidade de criar perímetros de atenção no mapa, com desenho circular e integração com o Leaflet Draw.

### [PR 8: View](https://github.com/GabFiterman/leaflet-zen/pull/14)
Adição de uma lista no menu lateral para visualizar pontos, áreas e perímetros salvos, com destaque para exclusão de itens, estilização geral e melhorias de desempenho.

## Bugs Conhecidos
Infelizmente, alguns bugs ainda estão presentes, e serão abordados em futuras Issues. Recomenda-se interagir mínimamente com o mapa antes de qualquer ação para evitar problemas específicos de coordenadas.

## Aviso
Mesmo após o prazo do desafio, a intenção é continuar o desenvolvimento do projeto, abrindo Issues para correção de bugs e sugestões de melhorias.

# GabFiterman, Obrigado!
