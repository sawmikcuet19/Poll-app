# Poll Management System

A full-stack polling application that enables users to create, participate in, and manage polls with real-time voting, comments, and likes functionality.

---

## Project Scope

This application provides a comprehensive platform for:

- **User Management**: Registration, authentication, and role-based access control (Admin/User roles)
- **Poll Creation**: Users can create polls with multiple options, set expiration dates, and manage their content
- **Voting System**: Secure one-vote-per-user mechanism with real-time vote counting
- **Social Features**: Commenting and liking functionality for community engagement
- **Email Notifications**: Automated email capabilities for user notifications
- **Poll Analytics**: View vote distributions and participation statistics

---

## Tools & Technologies

### Backend
- **Framework**: Spring Boot 3.5.8
- **Language**: Java 21
- **Database**: MySQL 8.x
- **ORM**: Hibernate / Spring Data JPA
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Utilities**: Lombok, Apache Commons Lang3, JavaMail

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **Date Handling**: Day.js, Moment.js
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: Notistack

### Development Tools
- **IDE**: IntelliJ IDEA / VS Code
- **Database**: MySQL Server (port 3306)
- **Mail Testing**: SMTP (Gmail) or MailHog (localhost:1025)

---

## System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   React Client  │◄────►│  Spring Boot API │◄────►│   MySQL DB  │
│   (Port 5173)   │      │   (Port 9000)    │      │ (Port 3306) │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

---

## Project Structure

```
Poll-Spring-Boot/
├── Poll-Spring-Boot/          # Backend Spring Boot Application
│   ├── src/main/java/
│   │   └── com/poll/Poll_Spring_Boot/
│   │       ├── config/        # Security & App Configuration
│   │       ├── controllers/   # REST API Controllers
│   │       ├── dtos/          # Data Transfer Objects
│   │       ├── entities/      # JPA Entities (User, Poll, Vote, etc.)
│   │       ├── enums/         # Enums (UserRole)
│   │       ├── filters/       # JWT Filter
│   │       ├── repositories/  # Spring Data Repositories
│   │       └── services/      # Business Logic Services
│   └── src/main/resources/
│       └── application.properties
├── poll-react/                # Frontend React Application
│   ├── src/
│   │   ├── components/        # React Components
│   │   └── ...
│   └── package.json
└── http/                      # HTTP test files
```

---

## Execution System

### Prerequisites
- Java 21 JDK
- Node.js 18+
- MySQL Server 8.x
- Maven 3.8+

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE poll_db;
```

2. Configure database credentials in `Poll-Spring-Boot/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/poll_db
spring.datasource.username=root
spring.datasource.password=password
```

3. Configure email settings (optional):
```properties
spring.mail.username=your.email@gmail.com
spring.mail.password=your-app-password
```

### Backend Execution

```bash
cd Poll-Spring-Boot
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:9000`

### Frontend Execution

```bash
cd poll-react
npm install
npm run dev
```

The frontend development server will start on `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/reset-password` - Password reset

### Polls
- `GET /api/polls` - Get all active polls
- `GET /api/polls/{id}` - Get poll by ID
- `POST /api/polls` - Create new poll
- `PUT /api/polls/{id}` - Update poll
- `DELETE /api/polls/{id}` - Delete poll
- `POST /api/polls/{id}/vote` - Cast vote
- `POST /api/polls/{id}/comment` - Add comment
- `POST /api/polls/{id}/like` - Like/unlike poll

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │───────│   Poll   │───────│  Options │
│  (1:N)   │       │  (1:N)   │       │          │
└──────────┘       └──────────┘       └──────────┘
       │                  │
       │             ┌──────────┐
       │             │   Vote   │
       │             │  (N:1)   │
       │             └──────────┘
       │
       └──────────┬──────────┐
                  │          │
             ┌────────┐  ┌────────┐
             │Comment │  │  Like  │
             └────────┘  └────────┘
```

---

## Security

- JWT-based authentication with configurable expiration
- Password encryption using BCrypt
- Role-based access control (ADMIN, USER)
- CORS configuration for frontend communication
- Protected API endpoints

---

## Author

**Sawmik Kumar Paul**
- Department of CSE
- Chittagong University of Engineering and Technology (CUET)
- Email: sawmik.paul@gmail.com
