✅ NestJS Interview Q&A (Basic → Advanced)
🔹 Basic (1–10)

1) What is NestJS and why use it over Express?
Answer: NestJS is a TypeScript-first server framework on Node.js. It adds a clear structure (modules, controllers, providers), dependency injection, decorators, and built-in testing. Compared to Express, Nest helps large teams keep code organized and testable.

2) What are Modules, Controllers, and Providers?
Answer:

Module groups related pieces (controllers/providers).

Controller handles routes and HTTP I/O.

Provider/Service holds business logic and can be injected.

@Module({ controllers: [UserController], providers: [UserService] })
export class UserModule {}


3) How does Dependency Injection work in NestJS?
Answer: Providers are registered in a module and injected via the constructor using Nest’s IoC container.

@Injectable()
export class UserService {}
@Controller()
export class UserController {
  constructor(private readonly users: UserService) {}
}


4) How do you create a REST endpoint?
Answer: Define a controller and map route handlers with decorators.

@Controller('users')
export class UserController {
  constructor(private readonly svc: UserService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Post() create(@Body() dto: CreateUserDto) { return this.svc.create(dto); }
}


5) What are DTOs and why use them?
Answer: DTOs define the data shape. Pair with class-validator to validate inputs.

export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() email: string;
}


6) What are Pipes? How do you enable global validation?
Answer: Pipes transform/validate input before reaching handlers.

// main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));


7) What’s the difference between Middleware, Guards, and Interceptors?
Answer:

Middleware: runs before the route (logging, parsing).

Guards: allow/deny execution (auth/roles).

Interceptors: wrap execution (logging, mapping responses, caching).

8) How do you access environment variables?
Answer: Use @nestjs/config.

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })] })
export class AppModule {}
constructor(private cfg: ConfigService) { const host = this.cfg.get('DB_HOST'); }


9) How do you create a custom parameter decorator?
Answer:

export const CurrentUser = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
@Get('me') me(@CurrentUser() user: any) { return user; }


10) How do you add request logging?
Answer: Use middleware or an interceptor.

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: Function) {
    console.log(req.method, req.url); next();
  }
}

🔸 Intermediate (11–20)

11) How do Guards work? Show a simple AuthGuard.
Answer:

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    return Boolean(req.user); // e.g., set by middleware/jwt strategy
  }
}
@UseGuards(AuthGuard) @Get('profile') getProfile() {}


12) How do Interceptors help with response mapping or timing logs?
Answer: Interceptors run before and after the route handler.

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler) {
    const t0 = Date.now();
    return next.handle().pipe(tap(() => console.log('ms:', Date.now() - t0)));
  }
}


13) How do Exception Filters work?
Answer: They centralize error handling.

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(ex: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(ex.getStatus()).json({ message: ex.message });
  }
}


Apply globally or per-controller.

14) How do you validate and transform params (e.g., id to number)?
Answer: Use built-in pipes like ParseIntPipe.

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }


15) How do you organize a large project?
Answer: Feature modules, shared module for common providers, core module for app-wide singletons, consistent foldering (module/controller/service/dto). Avoid dumping everything in AppModule.

16) How do you implement pagination, filtering, and sorting?
Answer: Accept query DTO, validate, and pass to service.

export class FindUsersQuery {
  @IsInt() @Type(() => Number) @Min(1) page = 1;
  @IsInt() @Type(() => Number) @Min(1) limit = 20;
}
@Get() list(@Query() q: FindUsersQuery) { return this.svc.list(q); }


17) How do you use Caching?
Answer: Use @nestjs/cache-manager or a cache interceptor.

@Module({ imports: [CacheModule.register({ isGlobal: true, ttl: 10 })] })
@UseInterceptors(CacheInterceptor)
@Get() list() { return this.svc.getExpensiveData(); }


18) How do you handle file uploads?
Answer: Use @nestjs/platform-express (Multer).

@Post('avatar')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file: Express.Multer.File) { return file.filename; }


19) How do you document APIs with Swagger?
Answer: @nestjs/swagger.

const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build();
const doc = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, doc);


Use decorators like @ApiTags, @ApiProperty.

20) How do you write unit tests for a service/controller?
Answer:

describe('UserService', () => {
  let svc: UserService;
  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [UserService, { provide: Repo, useValue: mockRepo }],
    }).compile();
    svc = mod.get(UserService);
  });
  it('findAll', async () => { expect(await svc.findAll()).toHaveLength(2); });
});

🔺 Advanced (21–30)

21) Explain provider scopes: Default, Request-scoped, Transient.
Answer:

Default (Singleton): one instance per app/module context.

Request-scoped: new instance per request (heavier).

Transient: new instance per injection.
Use request scope when state depends on request (e.g., per-request user context).

22) How do you resolve circular dependencies?
Answer: Use forwardRef.

@Module({ providers: [AService, { provide: BService, useClass: forwardRef(() => BService) }] })
export class AModule {}
@Injectable() export class AService { constructor(@Inject(forwardRef(() => BService)) private b: BService) {} }


Better: re-think design; extract shared parts to a new module.

23) What are Dynamic Modules and why use them?
Answer: They return a module definition at runtime (e.g., configure SDKs).

@Module({})
export class MailModule {
  static register(opts: MailOptions): DynamicModule {
    return { module: MailModule, providers: [{ provide: MAIL_OPTS, useValue: opts }], exports: [MAIL_OPTS] };
  }
}


24) How do you build a Global Module or Global Pipe/Guard?
Answer:

Global module: @Global() + import once.

Global pipe/guard: configure in main.ts.

@Global() @Module({ providers: [PrismaService], exports: [PrismaService] })
export class DatabaseModule {}
app.useGlobalGuards(new RolesGuard(reflector));


25) How do you handle transactions (TypeORM or Prisma)?
Answer (Prisma example):

await this.prisma.$transaction(async (tx) => {
  await tx.user.create({ data: a });
  await tx.order.create({ data: b });
});


Keep business logic in services; keep transactions small.

26) How do you implement Role-based Access Control (RBAC)?
Answer: Use metadata + guard.

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private refl: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const roles = this.refl.get<string[]>('roles', ctx.getHandler()) ?? [];
    const user = ctx.switchToHttp().getRequest().user;
    return roles.length ? roles.includes(user?.role) : true;
  }
}
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin') @Delete(':id') remove() {}


27) How do you integrate queues or background jobs (Bull/BullMQ)?
Answer: Use @nestjs/bull.

@Module({ imports: [BullModule.forRoot({}), BullModule.registerQueue({ name: 'emails' })] })
export class AppModule {}
@Injectable() export class EmailProducer {
  constructor(@InjectQueue('emails') private q: Queue) {}
  async enqueue(payload: any) { await this.q.add('send', payload); }
}
@Processor('emails')
export class EmailConsumer {
  @Process('send') async handle(job: Job) { /* send email */ }
}


28) How do you build Microservices with NestJS?
Answer: Use @nestjs/microservices and pick a transport (TCP, Redis, NATS, Kafka, RMQ).

// microservice bootstrap
app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP });
await app.startAllMicroservices();


Use ClientProxy for request/response messaging.

29) How do you implement WebSockets or real-time features?
Answer: Use @WebSocketGateway() and @SubscribeMessage().

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage('message') handleMessage(@MessageBody() msg: string) { this.server.emit('message', msg); }
}


30) How do you ensure production readiness (perf, resilience, DX)?
Answer:

Validation & DTOs everywhere.

Global exception filter & consistent error shape.

Config per env, never hardcode secrets.

Caching, HTTP timeouts, retries where needed.

Graceful shutdown: enable app.enableShutdownHooks().

Health checks with Terminus, metrics (Prometheus/OpenTelemetry).

E2E tests, linting, and CI.

API versioning and rate limiting.

app.enableVersioning({ type: VersioningType.URI });
app.enableShutdownHooks();

🛠️ Practical Scenarios (Bonus)

A) Secure an admin-only DELETE endpoint

Use JWT strategy → set req.user.

Guard checks role → allow only admin.

Add audit log via interceptor.

B) Global request ID + structured logs

Middleware to attach req.id (uuid).

Interceptor logs id, route, timing.

Pipe/Filter include id in error response.

C) Multi-tenant header-based DB

Middleware reads x-tenant-id.

Request-scoped provider selects proper DB client.

Ensure connection pooling + caching per tenant.

🧠 Quick Revision Bullets

Modules/Controllers/Providers = structure.

DI = testable, decoupled services.

DTO + ValidationPipe = safe inputs.

Middleware vs Guard vs Interceptor = timing and purpose.

Exception Filters = centralized errors.

Config/ENV = no hardcoded secrets.

Caching/Queues = performance & reliability.

Microservices/WebSockets = scalability & realtime.

Testing = unit + e2e with @nestjs/testing.