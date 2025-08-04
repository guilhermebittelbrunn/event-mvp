# NestJS Boilerplate

Um boilerplate robusto e escalável para aplicações NestJS, desenvolvido com foco em arquitetura limpa, boas práticas e facilidade de uso para novos projetos.

## 🚀 Características

### ✨ Funcionalidades Principais
- **Arquitetura Limpa (Clean Architecture)** - Separação clara entre domínio, aplicação e infraestrutura
- **Autenticação JWT** - Sistema completo de autenticação com refresh tokens
- **Banco de Dados PostgreSQL** - Configurado com Prisma ORM
- **Documentação Automática** - Swagger/OpenAPI integrado
- **Logging Estruturado** - Pino logger com formatação otimizada
- **Cache Manager** - Sistema de cache configurável
- **Validação de Dados** - Class-validator integrado
- **Testes Automatizados** - Jest configurado para testes unitários e e2e
- **Docker** - Configuração para desenvolvimento e produção

### 🏗️ Infraestrutura
- **AWS S3** - Armazenamento de arquivos
- **AWS SQS** - Sistema de mensageria
- **New Relic** - Monitoramento e APM
- **Discord** - Sistema de notificações
- **Fastify** - Servidor HTTP de alta performance

### 🛠️ Ferramentas de Desenvolvimento
- **TypeScript** - Tipagem estática
- **ESLint + Prettier** - Linting e formatação de código
- **Husky** - Git hooks
- **Commitlint** - Padronização de commits
- **Prisma Studio** - Interface visual para o banco de dados

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (recomendado) ou npm
- Docker e Docker Compose
- PostgreSQL

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd nest_boilerplate
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Configure as variáveis no arquivo .env**
```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5436/database
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_VOLUME_PATH=./postgres-data

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# AWS (opcional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket
AWS_SQS_QUEUE_URL=your_queue_url

# New Relic (opcional)
NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=your_app_name

# Discord (opcional)
DISCORD_WEBHOOK_URL=your_webhook_url
```

5. **Inicie o banco de dados**
```bash
pnpm up:db
```

6. **Execute as migrações**
```bash
pnpm migration:run
```

7. **Execute o seed (opcional)**
```bash
pnpm seed:run
```

8. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000` e o Prisma Studio em `http://localhost:5555`.

## 📚 Estrutura do Projeto

```
src/
├── infra/                    # Camada de infraestrutura
│   ├── database/            # Configurações de banco de dados
│   ├── jwt/                 # Implementações JWT
│   ├── messageLogger/       # Sistema de logging de mensagens
│   ├── messaging/           # Sistema de mensageria
│   ├── networkLogger/       # Logging de rede
│   └── services/            # Serviços externos (S3, Cache)
├── module/                  # Módulos da aplicação
│   └── user/               # Módulo de usuários (exemplo)
│       ├── domain/         # Regras de negócio
│       ├── dto/            # Data Transfer Objects
│       ├── repositories/   # Interfaces e implementações
│       └── useCases/       # Casos de uso
├── repositories/           # Repositórios base
├── shared/                 # Código compartilhado
│   ├── config/            # Configurações
│   ├── core/              # Entidades e value objects
│   ├── decorators/        # Decorators customizados
│   ├── exceptions/        # Filtros de exceção
│   ├── guards/            # Guards de autenticação
│   ├── interceptors/      # Interceptors
│   ├── strategies/        # Estratégias de autenticação
│   └── utils/             # Utilitários
└── main.ts                # Ponto de entrada da aplicação
```

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm dev              # Inicia o servidor em modo desenvolvimento
pnpm start            # Inicia o servidor
pnpm start:debug      # Inicia em modo debug
pnpm start:prod       # Inicia em modo produção
```

### Banco de Dados
```bash
pnpm up:db            # Inicia o banco de dados
pnpm down             # Para o banco de dados
pnpm migration:create # Cria uma nova migração
pnpm migration:run    # Executa as migrações
pnpm generate         # Gera o cliente Prisma
pnpm seed:run         # Executa o seed
pnpm studio           # Abre o Prisma Studio
```

### Testes
```bash
pnpm test             # Executa todos os testes
pnpm test:watch       # Executa testes em modo watch
pnpm test:cov         # Executa testes com cobertura
pnpm test:e2e         # Executa testes end-to-end
```

### Qualidade de Código
```bash
pnpm lint             # Executa o linter
pnpm typechecks       # Verifica tipos TypeScript
```

## 🔐 Autenticação

O boilerplate inclui um sistema completo de autenticação JWT:

### Endpoints Disponíveis
- `POST /v1/auth/signup` - Cadastro de usuário
- `POST /v1/auth/signin` - Login
- `POST /v1/auth/refresh` - Renovação de token

### Uso dos Guards
```typescript
import { JwtAuthGuard } from './shared/guards/jwtAuth.guard';
import { UserRoleGuard } from './shared/guards/userRole.guard';

@UseGuards(JwtAuthGuard, UserRoleGuard)
@Roles('admin')
@Get('protected')
getProtectedData() {
  return 'Dados protegidos';
}
```

## 📖 Documentação da API

A documentação Swagger está disponível em:
- **Desenvolvimento**: `http://localhost:3000/docs`
- **Produção**: `https://your-domain.com/docs`

## 🧪 Testes

### Estrutura de Testes
- **Testes Unitários**: `*.spec.ts`
- **Testes E2E**: `*.e2e-spec.ts`
- **Fakes**: Implementações falsas para testes

### Executando Testes
```bash
# Testes unitários
pnpm test

# Testes com cobertura
pnpm test:cov

# Testes end-to-end
pnpm test:e2e
```

## 🐳 Docker

### Desenvolvimento
```bash
# Banco de dados
docker-compose -f docker-compose.db.yml up -d
```

### Produção
```bash
# Build da imagem
docker build -t nestjs-boilerplate .

# Executar container
docker run -p 3000:3000 nestjs-boilerplate
```

## 🔧 Configurações

### Variáveis de Ambiente Principais
- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (development, production, test)
- `POSTGRES_URL` - URL de conexão com PostgreSQL
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_REFRESH_SECRET` - Chave secreta para refresh token

### Configurações do Logger
O sistema usa Pino para logging estruturado:
- **Desenvolvimento**: Logs formatados e coloridos
- **Produção**: Logs em JSON para melhor parsing

## 📦 Módulos Incluídos

### User Module (Exemplo)
- CRUD completo de usuários
- Autenticação e autorização
- Validação de dados
- Testes unitários e e2e

### Infraestrutura
- **Prisma**: ORM com migrations automáticas
- **Cache**: Sistema de cache configurável
- **S3**: Upload e gerenciamento de arquivos
- **SQS**: Sistema de mensageria assíncrona
- **New Relic**: Monitoramento de performance
- **Discord**: Notificações e alertas

## 🚀 Deploy

### Preparação para Produção
1. Configure as variáveis de ambiente de produção
2. Execute as migrações: `pnpm migration:run`
3. Build da aplicação: `pnpm build`
4. Execute: `pnpm start:prod`

### Plataformas Suportadas
- **Heroku**: Configuração automática
- **AWS**: ECS, Lambda, EC2
- **Google Cloud**: App Engine, Cloud Run
- **Azure**: App Service, Container Instances

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](https://docs.nestjs.com/)
2. Procure por issues similares no repositório
3. Abra uma nova issue com detalhes do problema

## 🔄 Atualizações

Para manter o boilerplate atualizado:

```bash
# Atualizar dependências
pnpm update

# Verificar vulnerabilidades
pnpm audit

# Atualizar Prisma
pnpm prisma update
```

---

**Desenvolvido com ❤️ usando NestJS**
