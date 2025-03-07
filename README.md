# NMalls - Sistema de Gestão de Entregas

Sistema de gestão de entregas com rastreamento em tempo real, desenvolvido com Next.js, React e Tailwind CSS.

## Funcionalidades

- Dashboard com visão geral das entregas
- Gestão de entregas com rastreamento em tempo real
- Confirmação de entrega com assinatura do cliente
- Interface adaptada para dispositivos móveis para entregadores
- Gestão de compras e fornecedores
- Sistema de trocas e empréstimos
- Gestão de influenciadores
- Configurações personalizáveis

## Tecnologias Utilizadas

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Leaflet (para mapas)
- Geolocalização em tempo real

## Requisitos

- Node.js 18.17 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/nmalls.git
cd nmalls
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `/src/app` - Páginas da aplicação (Next.js App Router)
- `/src/components` - Componentes reutilizáveis
- `/src/services` - Serviços e APIs
- `/src/lib` - Funções utilitárias
- `/public` - Arquivos estáticos

## Configuração para Produção

Para construir a versão de produção:

```bash
npm run build
# ou
yarn build
```

Para iniciar o servidor em modo de produção:

```bash
npm start
# ou
yarn start
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes. 