# Tráfego Inteligente

Sistema de monitoramento inteligente de frota com reconhecimento automático de placas (ANPR) para cidades inteligentes.

## Sobre o Projeto

Tráfego Inteligente é uma aplicação web para monitoramento e gestão de caminhões em áreas urbanas. O sistema utiliza tecnologia de reconhecimento automático de placas (ANPR) para identificar veículos e rastrear sua entrada, permanência e saída da cidade.

### Principais Funcionalidades

- Reconhecimento automático de placas de veículos
- Dashboard em tempo real com estatísticas de fluxo
- Monitoramento de status de caminhões (entrando, na cidade, saindo, fora)
- Registro e histórico de movimentação de veículos
- Interface intuitiva para gestão de frota

# Tráfego Inteligente
## Requisitos do Sistema

- Node.js (versão 16.1 ou superior)
- npm (versão 8.0 ou superior) ou yarn (versão 1.22 ou superior)
- Navegador

## Tecnologias Utilizadas

### Frontend
- React 18 (Interface do usuário)
- TypeScript (Opção pra ser mais simples de entender pra mim)
- Tailwind CSS (Style)
- Framer Motion (para algumas animações pequenas que peguei pronto)
- Recharts (para visualização de dados dos dashboardss)
- React Router DOM (para navegação)
- Shadcn UI (usei em alguns componentes de interface pra reutilizá-los)

### Backend
- Supabase (autenticação, banco de dados e armazenamento)
- Funções serverless para processamento de imagens (Edge pra tempo real e reconhecimento de placas com uma ferramenta externa, consumindo uma API)

### Reconhecimento de Placas
- Piloto foi usado o Tesseract.js para OCR (Reconhecimento Óptico de Caracteres), houve menos confiabilidade, mas é possível reutilizar.
- Algoritmos de processamento de imagem para detecção de placas

## Ferramentas de Desenvolvimento
- Vite (para build e desenvolvimento)
- ESLint (para linting de código, usei para aprender e pegar alguns erros mais fáceis no desenvolvimento )
- TypeScript
- Tailwind CSS (para estilização)
- PostCSS (para processamento de CSS, aprendi em um vídeo no youtube como implementar)
- Swagger UI : Documentação interativa da API (Usei para documentar a API e usei uma IA pra me ajudar, pois fiz na mão do zero e me bati 3 dias pra funcionar)

## Arquitetura do Sistema

O sistema segue uma arquitetura de camadas com:
- Interface do usuário (React + Tailwind)
- Lógica de negócios (Contextos e Hooks React)
- Serviços de API (Integração com Supabase)
- Processamento de imagens (Tesseract.js e Ferramenta externa usada via API)

## Fluxo de Reconhecimento de Placas

1. Captura de imagem do veículo
2. Pré-processamento da imagem (ajuste de contraste, remoção de ruído)
3. Detecção da região da placa
4. OCR/ANPR para extrair os caracteres da placa
5. Validação e formatação do resultado
6. Armazenamento e exibição dos dados

## Integração com Sistemas Externos

O sistema permite integração com:
- APIs de órgãos de trânsito (Pós MVP)
- Sistemas de gestão de frota (Pós MVP ou através de APIs)
- Bancos de dados de veículos (Com dados báiscos a princípio)
- Sistemas de segurança e monitoramento (Pós MVP)

## Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Instalação

Siga estas etapas para configurar o projeto em sua máquina local:

1. Clone o repositório:
```bash
git clone https://github.com/danielscremim/trafego_inteligente.git
cd trafego_inteligente
```
2. Rode o repositório localmente:
```bash
npm run dev
```
