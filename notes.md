📘 NestJS Notes
1. Introduction to NestJS
Definition / Core Idea

One-liner: NestJS is a progressive Node.js framework built with TypeScript for building scalable server-side applications.

Explanation: It brings Angular-inspired architecture (Modules, Controllers, Services) and emphasizes Dependency Injection and decorators for clean, testable code.

Why It’s Important

Express.js apps get messy in large projects; NestJS provides structure.

Scales well for enterprise-level applications.

Encourages clean separation of concerns.

Interview Angle

Q: Why use NestJS instead of Express.js?
A: Express is minimal and unopinionated, so large projects often become messy. NestJS adds structure, DI, modularity, TypeScript support, and built-in testing utilities.

Q: What design patterns does NestJS use?
A: Dependency Injection, Inversion of Control, and Module-based architecture.

2. Modules
Definition / Core Idea

A Module groups related functionality (controllers, services, providers).

Annotated with @Module() decorator.

Example
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

Pitfalls & Best Practices

❌ Don’t put everything in AppModule.

✅ Use feature modules like UserModule, AuthModule.

Interview Angle

Q: What is the role of @Module in NestJS?
A: It organizes code into logical units. Each module can import/export other modules and provide its services.

Q: How do you structure a large NestJS project?
A: Break down by features (user, auth, orders) with each feature having its own module, controller, service, and DTOs.

3. Controllers
Definition / Core Idea

Handle incoming requests and return responses.

Example
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}

Best Practices

Keep controllers thin; delegate business logic to services.

Interview Angle

Q: How do controllers differ from services?
A: Controllers handle HTTP requests/responses. Services contain business logic. Controllers call services.

Q: How are routes defined in NestJS?
A: With @Controller('route') and method decorators like @Get(), @Post(), @Put(), etc.

4. Services & Dependency Injection (DI)
Definition / Core Idea

Services hold reusable business logic.

DI allows NestJS to inject services where needed automatically.

Example
@Injectable()
export class UserService {
  findAll() {
    return ['user1', 'user2'];
  }
}


Injected in controller:

constructor(private readonly userService: UserService) {}

Pitfalls & Best Practices

❌ Don’t put DB logic inside controllers.

✅ Use services for testable, reusable logic.

Interview Angle

Q: What is Dependency Injection?
A: It’s a pattern where dependencies are provided (injected) instead of being created inside a class. NestJS uses constructor-based DI.

Q: Why does NestJS use DI?
A: It improves testability, reduces coupling, and makes services reusable.

5. DTOs (Data Transfer Objects)
Definition / Core Idea

DTOs define shape of incoming data for consistency and validation.

Example
export class CreateUserDto {
  name: string;
  email: string;
}

Best Practices

Always pair DTOs with ValidationPipe.

Interview Angle

Q: Why use DTOs in NestJS?
A: To enforce strict data contracts and ensure data validation before it reaches business logic.

Q: How do DTOs improve maintainability?
A: By centralizing request/response shapes, making APIs predictable and reducing duplication.

6. Pipes & Global Pipes
Definition / Core Idea

Pipes transform and validate request data.

Example
@UsePipes(new ValidationPipe())
@Post()
create(@Body() dto: CreateUserDto) {}


Global pipe:

app.useGlobalPipes(new ValidationPipe());

Interview Angle

Q: Difference between Pipes, Guards, and Interceptors?
A:

Pipes → validate/transform input.

Guards → control access/authentication.

Interceptors → modify request/response lifecycle (e.g., logging, response mapping).

Q: How do you validate input globally?
A: Use app.useGlobalPipes(new ValidationPipe()); in main.ts.

7. Middleware
Definition / Core Idea

Middleware is executed before controllers.

Example
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  }
}

Interview Angle

Q: How do middlewares differ from guards?
A: Middleware runs before the route handler (good for logging, transformations). Guards run after middleware, specifically to decide access.

Q: When would you use middleware instead of interceptors?
A: Middleware is better for tasks like logging or parsing request bodies, before NestJS context is created. Interceptors are better for cross-cutting concerns like response mapping.

8. Guards
Definition / Core Idea

Guards decide whether a request is allowed (auth/roles).

Example
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    return !!req.user; 
  }
}

Interview Angle

Q: Difference between Guards and Middleware?
A: Middleware is general-purpose, doesn’t know about NestJS context. Guards are aware of route context and are ideal for authorization.

Q: How to secure a route in NestJS?
A: Apply @UseGuards(AuthGuard) on controller routes.

9. Custom Parameter Decorators
Example
export const User = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);


Usage:

@Get('profile')
getProfile(@User() user: any) {
  return user;
}

Interview Angle

Q: Why create custom decorators?
A: To extract frequently used request data (e.g., logged-in user) cleanly, without repeating boilerplate in every controller.

10. Config Module
Example
@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}


Usage:

constructor(private config: ConfigService) {
  const dbHost = this.config.get<string>('DB_HOST');
}

Interview Angle

Q: How does NestJS manage env variables?
A: Using @nestjs/config, which loads .env files and provides them via ConfigService.

11. RESTful APIs in NestJS
Steps

Generate module, service, controller.

Create DTOs.

Add CRUD endpoints.

Apply validation pipes.

Connect DB.

Example
@Post()
create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}

Interview Angle

Q: Walk me through creating a REST API in NestJS.
A: Define DTOs → Create Service for business logic → Create Controller for routes → Add Pipes for validation → Use Guards for protection → Connect to DB with Repository/ORM.

📌 Quick Summary

🚀 Modules: Organize features.

🚀 Controllers: Handle requests.

🚀 Services: Business logic.

🚀 DI: Decoupling & testability.

🚀 DTO + Pipes: Validation.

🚀 Middleware vs Guards: Pre-routing vs Authorization.

🚀 Config Module: Environment management.

🎯 Mini Coding Exercise (with Solution)

👉 Task: Create a User API with:

POST /users → Create user (validate with DTO).

GET /users → Fetch users.

Logger Middleware to log all requests.

Guard to protect DELETE /users/:id.

✅ Solution Sketch:

UserModule, UserService, UserController.

DTO CreateUserDto { name: string; email: string; } + ValidationPipe.

Middleware logs all requests.

AuthGuard → checks req.user.role === 'admin' before allowing deletion.