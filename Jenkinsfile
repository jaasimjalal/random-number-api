pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'random-number-api'
        CONTAINER_NAME = 'random-number-api-test'
        PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node Environment') {
            steps {
                sh '''
                    # Install dependencies
                    npm ci
                '''
            }
        }
        
        stage('Lint & Format Check') {
            steps {
                sh '''
                    # Run linting
                    npm run lint || echo "Lint warnings found, continuing..."
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    # Run unit and integration tests
                    npm test
                '''
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }
        
        stage('Build TypeScript') {
            steps {
                sh '''
                    # Clean build
                    rm -rf dist/
                    npm run build
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh '''
                    # Build production Docker image
                    docker build -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }
        
        stage('Run Container & Health Check') {
            steps {
                script {
                    // Stop and remove existing container if running
                    sh '''
                        docker stop ${CONTAINER_NAME} 2>/dev/null || true
                        docker rm ${CONTAINER_NAME} 2>/dev/null || true
                    '''
                    
                    // Start container
                    sh '''
                        docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${DOCKER_IMAGE}:latest
                    '''
                    
                    // Wait for container to be ready
                    sh '''
                        echo "Waiting for container to be ready..."
                        sleep 5
                    '''
                    
                    // Health check
                    sh '''
                        echo "Performing health check..."
                        curl -f http://localhost:${PORT}/health || exit 1
                    '''
                    
                    // Test API endpoint
                    sh '''
                        echo "Testing random number endpoint..."
                        curl -f http://localhost:${PORT}/v1/random?min=10&max=20 || exit 1
                    '''
                    
                    // Cleanup
                    sh '''
                        echo "Cleaning up container..."
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    '''
                }
            }
        }
        
        stage('Build Summary') {
            steps {
                sh '''
                    echo "=== Build Summary ==="
                    echo "Docker Image: ${DOCKER_IMAGE}:latest"
                    echo "Port: ${PORT}"
                    echo "Tests: PASSED"
                    echo "Health Check: PASSED"
                    echo "API Test: PASSED"
                '''
            }
        }
    }
    
    post {
        always {
            sh '''
                # Cleanup containers and images
                docker stop ${CONTAINER_NAME} 2>/dev/null || true
                docker rm ${CONTAINER_NAME} 2>/dev/null || true
            '''
            cleanWs()
        }
        success {
            echo '=== Pipeline completed successfully ==='
        }
        failure {
            echo '=== Pipeline failed ==='
        }
    }
}
