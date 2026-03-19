# Java Spring Boot Enterprise Blueprint

Production-grade Java Spring Boot modular monolith demonstrating all ADBM principles.

---

## Architecture Overview

```
src/main/java/com/adbm/api/
├── controller/
│   └── UserController.java          # REST endpoints
├── service/
│   └── UserService.java             # Business logic + caching
├── repository/
│   └── UserRepository.java          # JPA data access
├── entity/
│   └── User.java                    # JPA entity
├── dto/
│   ├── CreateUserDto.java           # Request validation
│   └── UserResponseDto.java         # Response serialization
├── exception/
│   ├── BusinessException.java       # Custom exceptions
│   ├── NotFoundException.java
│   └── GlobalExceptionHandler.java  # @ControllerAdvice
├── config/
│   ├── SecurityConfig.java          # Spring Security + JWT
│   ├── CacheConfig.java             # Redis configuration
│   ├── DatabaseConfig.java          # JPA/Hikari settings
│   └── SwaggerConfig.java           # OpenAPI docs
└── AdbmApplication.java             # Main entry point

src/main/resources/
├── application.yml
├── application-dev.yml
├── application-prod.yml
└── db/migration/
    └── V1__init_schema.sql          # Flyway migrations
```

---

## Quick Start

```bash
# Prerequisites: JDK 17+, Docker, Maven

# Clone and setup
git clone <repo-url>
cd java-spring-boot

# Start infrastructure
docker-compose up -d

# Run migrations
./mvnw flyway:migrate

# Start application
./mvnw spring-boot:run

# API available at: http://localhost:8080
# Swagger docs: http://localhost:8080/swagger-ui.html
# Actuator: http://localhost:8080/actuator
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2 |
| **Database** | SQL Database (Standard) |
| **ORM** | Spring Data JPA (Hibernate) **or** MyBatis Plus |
| **Cache** | Redis + Spring Cache |
| **Security** | Spring Security + JWT |
| **Validation** | Jakarta Bean Validation |
| **API Docs** | SpringDoc OpenAPI 3 |
| **Metrics** | Micrometer + Prometheus |
| **Migration** | Flyway |
| **Build Tool** | Maven |

---

## ORM Choice: JPA vs MyBatis Plus

This blueprint uses **Spring Data JPA** by default. For teams preferring SQL-first development, see the **[MyBatis Plus Guide](../../docs/databases/mybatis-plus-guide.md)** for a complete alternative implementation.

| Aspect | Spring Data JPA | MyBatis Plus |
|--------|-----------------|--------------|
| **Philosophy** | ORM abstraction | SQL-first with auto CRUD |
| **Best For** | Standard CRUD, JPA ecosystem | Complex queries, SQL experts |
| **Learning Curve** | Steep (ORM concepts) | Moderate (SQL knowledge) |
| **Example** | `repository.findById(id)` | `mapper.selectById(id)` |

**Choose MyBatis Plus if**:
- ✅ Team has strong SQL expertise
- ✅ Need complex, optimized queries
- ✅ Prefer explicit SQL control

**See**: [Complete MyBatis Plus Implementation](../../docs/databases/mybatis-plus-guide.md)

---

## Key Features Demonstrated

✅ **Layered Architecture**: Controller → Service → Repository → Entity  
✅ **Spring Security**: JWT authentication + RBAC authorization  
✅ **Global Exception Handling**: @ControllerAdvice centralized errors  
✅ **Redis Caching**: @Cacheable/@CacheEvict annotations  
✅ **Bean Validation**: @Valid, @NotNull, @Email, custom validators  
✅ **Auto API Docs**: Swagger/OpenAPI via SpringDoc  
✅ **Actuator Endpoints**: Health checks, metrics, info  
✅ **Database Migrations**: Version-controlled schema with Flyway  
✅ **Connection Pooling**: HikariCP optimized configuration  
✅ **JPA Auditing**: Automatic createdAt/updatedAt timestamps

---

## Core Implementation Files

### 1. Entity (User.java)

```java
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_status_created", columnList = "status, created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime deletedAt;  // Soft delete
    
    // Getters, setters, equals, hashCode
}
```

### 2. Repository (UserRepository.java)

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    List<User> findAllActive();
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

### 3. Service (UserService.java)

```java
@Service
@Slf4j
public class UserService {
    
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    @Cacheable(value = "users", key = "#id")
    public UserResponseDto findById(Long id) {
        log.info("Fetching user from database: {}", id);
        User user = repository.findById(id)
            .orElseThrow(() -> new NotFoundException("User", id));
        return UserResponseDto.fromEntity(user);
    }
    
    @CacheEvict(value = "users", key = "#result.id")
    public UserResponseDto create(CreateUserDto dto) {
        // Check if email already exists
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BusinessException("Email already exists: " + dto.getEmail());
        }
        
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        
        User saved = repository.save(user);
        log.info("Created user: {}", saved.getId());
        
        return UserResponseDto.fromEntity(saved);
    }
    
    @Caching(evict = {
        @CacheEvict(value = "users", key = "#id"),
        @CacheEvict(value = "users", allEntries = true, condition = "#result == null")
    })
    public void delete(Long id) {
        User user = repository.findById(id)
            .orElseThrow(() -> new NotFoundException("User", id));
        
        // Soft delete
        user.setDeletedAt(LocalDateTime.now());
        repository.save(user);
        
        log.info("Soft deleted user: {}", id);
    }
}
```

### 4. Controller (UserController.java)

```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management APIs")
public class UserController {
    
    private final UserService service;
    
    public UserController(UserService service) {
        this.service = service;
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new user")
    public UserResponseDto createUser(@Valid @RequestBody CreateUserDto dto) {
        return service.create(dto);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public UserResponseDto getUser(@PathVariable Long id) {
        return service.findById(id);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete user (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")  // RBAC: Only admins can delete
    public void deleteUser(@PathVariable Long id) {
        service.delete(id);
    }
}
```

### 5. DTO (CreateUserDto.java)

```java
public class CreateUserDto {
    
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be non-negative")
    @Max(value = 120, message = "Age must be less than 120")
    private Integer age;
    
    // Getters, setters
}
```

### 6. Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(NotFoundException ex) {
        log.error("Not found error: {}", ex.getMessage());
        return new ErrorResponse(
            "NOT_FOUND",
            ex.getMessage(),
            HttpStatus.NOT_FOUND.value()
        );
    }
    
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessException(BusinessException ex) {
        log.error("Business error: {}", ex.getMessage());
        return new ErrorResponse(
            "BUSINESS_ERROR",
            ex.getMessage(),
            HttpStatus.BAD_REQUEST.value()
        );
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
            
        return new ErrorResponse(
            "VALIDATION_ERROR",
            String.join(", ", errors),
            HttpStatus.BAD_REQUEST.value()
        );
    }
}
```

### 7. Security Config (JWT)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    private final JwtAuthFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/actuator/health"
                ).permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
```

---

## Configuration (application.yml)

```yaml
spring:
  application:
    name: adbm-api
    
  datasource:
    url: jdbc:sql-db://localhost:port/adbm?useSSL=false
    username: ${DB_USER:user}
    password: ${DB_PASSWORD:password}
    driver-class-name: your.db.driver.Driver
    
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      
  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway for schema management
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1 hour
      
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      
  flyway:
    enabled: true
    locations: classpath:db/migration
    
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
        
logging:
  level:
    com.adbm.api: INFO
    org.hibernate.SQL: DEBUG
```

---

## Database Migration (V1__init_schema.sql)

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_status_created (status, created_at)
) ENGINE=StorageEngine DEFAULT CHARSET=utf8mb4;
```

---

## docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: sql-db-placeholder
    environment:
      DB_PASSWORD: password
      DB_NAME: adbm
    ports:
      - "port:port"
    volumes:
      - mysql_data:/var/lib/mysql
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
      
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
volumes:
  mysql_data:
```

---

## Testing

```bash
# Unit tests
./mvnw test

# Integration tests
./mvnw verify

# Coverage report
./mvnw jacoco:report

# Load test
artillery run load-test.yml
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/users/{id}` | Get user | Yes |
| POST | `/api/users` | Create user | Yes |
| DELETE | `/api/users/{id}` | Delete user | Admin |
| GET | `/actuator/health` | Health check | No |
| GET | `/actuator/metrics` | Metrics | No |

---

## ADBM Principles Demonstrated

📖 See [SKILL.md](../../SKILL.md) for detailed ADBM principles

✅ **Contract-First**: Auto-generated OpenAPI docs  
✅ **Layered Architecture**: Clear separation of concerns  
✅ **Exception Strategy**: Centralized @ControllerAdvice  
✅ **Cache-Aside**: Spring Cache with Redis  
✅ **Observability**: Micrometer + Prometheus metrics  
✅ **Security**: Spring Security + JWT + RBAC  
✅ **Performance**: HikariCP pooling, query optimization

---

## Alternative: MyBatis Plus

Prefer SQL-first development? See **[MyBatis Plus Guide](../../docs/databases/mybatis-plus-guide.md)** for:
- BaseMapper with auto CRUD operations
- QueryWrapper for dynamic queries
- Pagination and soft delete built-in
- Full SQL control with ORM convenience

---

> **Enterprise Java done right. Spring Boot + ADBM = Production-ready APIs.**
