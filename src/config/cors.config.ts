import { Request } from 'express';

interface CorsOptions {
	origin:
		| string[]
		| ((
				origin: string | undefined,
				callback: (err: Error | null, origin?: boolean) => void
		  ) => void);
	methods: string[];
	allowedHeaders: string[];
	exposedHeaders: string[];
	credentials: boolean;
	maxAge: number;
}

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const APPLICATION_BASE_URL = process.env.APPLICATION_BASE_URL;

if (!APPLICATION_BASE_URL) {
	throw new Error('APPLICATION_BASE_URL environment variable is not defined');
}

// Validate URL format
try {
	new URL(APPLICATION_BASE_URL);
} catch (error) {
	console.log('==== URL ERROR ==== :', error);
	throw new Error(`Invalid APPLICATION_BASE_URL: ${APPLICATION_BASE_URL}`);
}

// Additional origins can be added as comma-separated values in env
const ADDITIONAL_ALLOWED_ORIGINS = process.env.ADDITIONAL_ALLOWED_ORIGINS
	? process.env.ADDITIONAL_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
	: [];

// Combine frontend URL with any additional origins
const getAllowedOrigins = () => {
	const origins = [APPLICATION_BASE_URL, ...ADDITIONAL_ALLOWED_ORIGINS];

	// Filter out any empty strings and duplicates
	return [...new Set(origins.filter(Boolean))];
};

// CORS configuration
const corsOptions: CorsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
		const allowedOrigins = getAllowedOrigins();

		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) {
			callback(null, true);
			return;
		}

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			// Log attempted access with environment context
			console.warn(`CORS: Blocked request from origin: ${origin}`);
			console.warn(`Current environment: ${ENVIRONMENT}`);
			console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);

			callback(new Error('CORS: Request origin is not allowed'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: [
		'Origin',
		'X-Requested-With',
		'Content-Type',
		'Accept',
		'Authorization',
		'X-API-Key',
		'Accept-Language',
	],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	credentials: true,
	maxAge: 86400, // 24 hours
};

// Enhanced error handling with environment context
const handleCorsError = (err: Error, req: Request) => {
	if (err.message.startsWith('CORS')) {
		const errorContext = {
			error: err.message,
			origin: req.headers.origin,
			url: req.url,
			method: req.method,
			environment: ENVIRONMENT,
			allowedOrigins: getAllowedOrigins(),
			timestamp: new Date().toISOString(),
		};

		console.error('CORS Error Details:', JSON.stringify(errorContext, null, 2));
	}
};

export { corsOptions, handleCorsError };
