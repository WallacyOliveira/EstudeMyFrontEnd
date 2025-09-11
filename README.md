📚 EstudeMy – Guia de Instalação e Execução

Este projeto é composto por dois repositórios separados:

Frontend → Aplicação em Next.js (React)

Backend → API em Spring Boot (Java)

Este guia mostra como rodar tudo localmente e também com Docker/Docker Compose.
Inclui também todas as dependências do frontend para evitar incompatibilidades. 🚀

📂 Estrutura dos Repositórios
/frontend-repo        # Interface do usuário (Next.js)
/backend-repo         # API REST (Spring Boot)

🔧 1. Requisitos do Ambiente

Antes de começar, certifique-se de ter instalado:

Node.js (>= 18.x) e npm (>= 9.x)

Java JDK (>= 21)

Maven (>= 3.9) – se for buildar o backend localmente

Docker e Docker Compose (para rodar em containers)

📦 2. Dependências do Frontend

No repositório do frontend, este projeto utiliza:

| Pacote                        | Função                                   |
| ----------------------------- | ---------------------------------------- |
| **next**                      | Framework React para SSR/SSG             |
| **react** / **react-dom**     | Biblioteca base do React                 |
| **lucide-react**              | Ícones leves e personalizáveis           |
| **tailwindcss**               | Estilização com classes utilitárias      |
| **@tailwindcss/forms**        | Melhorias para formulários               |
| **react-bootstrap**           | Componentes prontos em estilo Bootstrap  |
| **bootstrap**                 | CSS base para o React-Bootstrap          |
| **@fullcalendar/react**       | Calendário interativo para React         |
| **@fullcalendar/daygrid**     | Visualização de calendário em grade      |
| **@fullcalendar/interaction** | Permite cliques e arraste no calendário  |
| **date-fns**                  | Manipulação de datas simples e eficiente |


Instale tudo com:

npm install next react react-dom lucide-react tailwindcss @tailwindcss/forms react-bootstrap bootstrap @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction date-fns


Dica: use --legacy-peer-deps se encontrar conflitos de versão:
npm install --legacy-peer-deps

🖥️ 3. Como Rodar Localmente (Sem Docker)
3.1 – Backend (Spring Boot)

No repositório do backend:

# Instale dependências e faça o build
./mvnw clean install

# Rode a aplicação
./mvnw spring-boot:run


API ficará disponível em: http://localhost:8080

3.2 – Frontend (Next.js)

No repositório do frontend:

# Instale dependências
npm install --legacy-peer-deps

# Rode em modo desenvolvimento
npm run dev


Interface ficará disponível em: http://localhost:3000

🐳 4. Como Rodar com Docker
4.1 – Buildar e rodar o Backend

No repositório do backend:

docker build -t estudemy-backend .
docker run -p 8080:8080 estudemy-backend

4.2 – Buildar e rodar o Frontend

No repositório do frontend:

docker build -t estudemy-frontend .
docker run -p 3000:3000 estudemy-frontend

🛠 5. Rodando Tudo com Docker Compose

Crie um arquivo docker-compose.yml em uma pasta central (ex: /devops):

version: "3.8"

services:
  backend:
    build: ../backend-repo
    container_name: estudemy-backend
    ports:
      - "8080:8080"
    networks:
      - estudemy-net

  frontend:
    build: ../frontend-repo
    container_name: estudemy-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: "http://backend:8080"
    depends_on:
      - backend
    networks:
      - estudemy-net

networks:
  estudemy-net:
    driver: bridge


Rodar tudo de uma vez:

docker-compose up --build

💡 6. Rodando em Diferentes IDEs
IntelliJ IDEA (Backend)

Abra o repositório do backend.

Confirme que o Maven importou as dependências.

Rode a classe principal (Application.java) pelo botão Run.

VS Code / WebStorm (Frontend)

Abra o repositório do frontend.

Instale as extensões: ES7+ React/Redux e Tailwind CSS IntelliSense.

Abra o terminal integrado e rode npm run dev.

🔑 7. Variáveis de Ambiente
Frontend (.env.local):
NEXT_PUBLIC_API_URL=http://localhost:8080

Backend (application.properties):
spring.datasource.url=jdbc:mysql://host:3306/estudemy
spring.datasource.username=root
spring.datasource.password=senha

🧪 8. Testando

Frontend: acesse http://localhost:3000

Backend: acesse http://localhost:8080/actuator/health → deve retornar {"status":"UP"}

🚀 9. Deploy

Utilize os Dockerfiles para gerar imagens e publicar no seu registry (DockerHub, ECR, etc.)

Utilize CI/CD para automatizar o build e deploy.


