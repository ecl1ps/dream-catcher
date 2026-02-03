import fastify, { FastifyInstance } from "fastify";
import path from "path";
import { app } from "electron";
//import fastifyStatic from "@fastify/static";

export interface WebServerConfig {
  port: number;
  host: string;
}

export class WebServer {
  private server: FastifyInstance;
  private port: number;
  private host: string;
  private isRunning = false;

  constructor(config: WebServerConfig) {
    this.port = config.port;
    this.host = config.host;

    this.server = fastify({
      logger: {
        level: "info",
      },
    });
  }

  async initialize() {
    // Enable CORS for all origins
    await this.server.register(
      (await import("@fastify/cors")).default,
      {
        origin: true, // Allow all origins
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
        credentials: true
      }
    );

    await this.setupRoutes();
    this.setupErrorHandling();
  }

  private async setupRoutes() {
    // Register static file serving for the React web app
    /*await this.server.register((await import("@fastify/static")).default, {
      root: path.join(__dirname, "..", "..", ".vite", "build", "webapp"),
      prefix: "/",
    });*/

    // API routes
    this.server.get("/api/health", async () => {
      return { status: "ok", timestamp: new Date().toISOString() };
    });

    this.server.get("/api/app-info", async () => {
      return {
        name: app.getName(),
        version: app.getVersion(),
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
      };
    });

    // Catch-all route for SPA routing
    this.server.setNotFoundHandler((request: any, reply: any) => {
      // For SPA routes, serve the index.html file
      if (!request.url.startsWith("/api/")) {
        reply.type("text/html").sendFile("index.html");
      } else {
        reply.code(404).send({ error: "API endpoint not found" });
      }
    });
  }

  private setupErrorHandling() {
    this.server.setErrorHandler((error: any, request: any, reply: any) => {
      console.error("Web server error:", error);
      reply.status(500).send({ error: "Internal server error" });
    });
  }

  async start(): Promise<string> {
    try {
      await this.initialize();
      const url = await this.server.listen({
        port: this.port,
        host: this.host,
      });
      this.isRunning = true;
      console.log(`Web server started at ${url}`);
      return url;
    } catch (error) {
      console.error("Failed to start web server:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.isRunning) {
      await this.server.close();
      this.isRunning = false;
      console.log("Web server stopped");
    }
  }

  isServerRunning(): boolean {
    return this.isRunning;
  }
}
