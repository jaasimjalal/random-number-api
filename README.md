# Random Number API

A simple, production-ready REST API for generating random numbers with configurable ranges.

## Features

- ✅ RESTful API with JSON responses
- ✅ Configurable min/max range
- ✅ Built-in rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Health check endpoint
- ✅ TypeScript + Express
- ✅ Docker containerized
- ✅ Automated testing
- ✅ Jenkins CI/CD pipeline

## API Endpoints

### Generate Random Number

```http
GET /v1/random
```

**Query Parameters:**
- `min` (optional, default: 0): Minimum value
- `max` (optional, default: 100): Maximum value
- `count` (optional, default: 1): Number of random numbers (1-100)

**Examples:**

```bash
# Generate single random number between 0-100
curl http://localhost:3000/v1/random

# Generate random number between 1-1000
curl http://localhost:3000/v1/random?min=1&max=1000

# Generate 5 random numbers between 10-50
curl http://localhost:3000/v1/random?min=10&max=50&count=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "numbers": [42],
    "count": 1,
    "min": 0,
    "max": 100
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Application port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `API_VERSION` | No | v1 | API version prefix |

See `.env.example` for full configuration.

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/jaasimjalal/random-number-api.git
cd random-number-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run in development
npm run dev

# Run in production
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## Docker

### Build and Run

```bash
# Build image
docker build -t random-number-api .

# Run container
docker run -p 3000:3000 --name random-number-api random-number-api

# Or use docker-compose
docker-compose up -d
```

### Pull and Run (when available)

```bash
docker pull jaasimjalal/random-number-api:latest
docker run -p 3000:3000 jaasimjalal/random-number-api:latest
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Jenkins CI/CD

The repository includes a Jenkinsfile for automated CI/CD pipeline:

- Build Docker image
- Run container
- Health check
- Automated testing

**Pipeline Job:** `random-number-api`

## API Documentation

### Request Examples

#### Single Random Number
```bash
curl -X GET http://localhost:3000/v1/random
```

#### With Range
```bash
curl -X GET http://localhost:3000/v1/random?min=1&max=100
```

#### Multiple Numbers
```bash
curl -X GET http://localhost:3000/v1/random?min=50&max=150&count=10
```

#### Health Check
```bash
curl -X GET http://localhost:3000/health
```

### Error Responses

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "message": "Max value must be greater than min value",
    "code": "VALIDATION_ERROR"
  }
}
```

**Rate Limit Error:**
```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```