# Fintech Dash

![React](https://img.shields.io/badge/React-blue)
![Vite](https://img.shields.io/badge/Vite-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![MUI](https://img.shields.io/badge/MUI-blue)
![Recharts](https://img.shields.io/badge/Recharts-blue)

Dashboard financeiro responsivo para análise de métricas, gráficos e indicadores de performance.

## ✨ Funcionalidades
- Visualização de métricas financeiras (KPIs) em tempo real/near real-time
- Gráficos interativos (Recharts) e componentes visuais de alta qualidade (MUI)
- Layout responsivo e acessível
- Organização por módulos/páginas com arquitetura escalável
- Scripts prontos para desenvolvimento, build e preview

## 🧱 Stack
- React • Vite • TypeScript
- UI: MUI (Material UI) + estilos utilitários
- Charts: Recharts
- Auxiliares comuns: Axios, React Router, etc. (se aplicável)

## 📁 Estrutura do projeto
├── src/
│ ├── assets/
│ ├── components/
│ ├── hooks/
│ ├── layouts/
│ ├── pages/
│ ├── services/
│ ├── store/
│ ├── types/
│ └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

> Observação: a árvore acima é um **exemplo**. Ajuste conforme a estrutura real do seu projeto.

## 🚀 Como rodar localmente

### Pré-requisitos
- **Node.js** >= 18 (recomendado usar nvm)
- Um gerenciador de pacotes: **npm**, **yarn** ou **pnpm**

### Passos (npm)
```bash
# 1) Instale as dependências
npm install

# 2) Variáveis de ambiente
# (opcional) copie .env.example -> .env e preencha as chaves

# 3) Inicie o ambiente de desenvolvimento
npm run dev