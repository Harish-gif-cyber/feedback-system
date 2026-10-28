pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = '24mis0031' // Replace with your Docker Hub ID if needed
        IMAGE_NAME = 'feedback-system'
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds' // Configured in Jenkins Credentials
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out project repository from GitHub...'
                // If using GitHub webhook/SCM checkout
                checkout scm
            }
        }

        stage('2. Lint & Validate Code') {
            steps {
                echo 'Validating Node.js syntax for all versions (Roll No: 24MIS0031)...'
                sh '''
                    node -c v1/server.js
                    node -c v2/server.js
                    node -c v3/server.js
                '''
            }
        }

        stage('3. Build Docker Images (v1, v2, v3)') {
            steps {
                echo 'Building Docker images for versions v1, v2, and v3...'
                sh '''
                    echo "--> Building Version 1 (Submit Feature)..."
                    docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v1 ./v1

                    echo "--> Building Version 2 (Submit + View Feature)..."
                    docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v2 ./v2

                    echo "--> Building Version 3 (Submit + View + Filter/Sort Feature)..."
                    docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v3 ./v3
                '''
            }
        }

        stage('4. Push to DockerHub') {
            steps {
                echo 'Logging in to DockerHub and pushing images...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v1
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v2
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:v3
                    '''
                }
            }
        }

        stage('5. Deploy to Kubernetes (Separate Deployments/Services)') {
            steps {
                echo 'Deploying all three versions to Kubernetes cluster...'
                sh '''
                    kubectl apply -f k8s/v1-deployment.yaml
                    kubectl apply -f k8s/v2-deployment.yaml
                    kubectl apply -f k8s/v3-deployment.yaml
                '''
            }
        }

        stage('6. Verify Deployments & Access Endpoints') {
            steps {
                echo 'Verifying rollout status for all versions...'
                sh '''
                    kubectl rollout status deployment/feedback-v1-deployment --timeout=90s
                    kubectl rollout status deployment/feedback-v2-deployment --timeout=90s
                    kubectl rollout status deployment/feedback-v3-deployment --timeout=90s

                    echo "=========================================================="
                    echo "DEPLOYMENT COMPLETED FOR ROLL NO: 24MIS0031"
                    echo "=========================================================="
                    echo "v1 (Submit Feature)       : http://localhost:30001"
                    echo "v2 (View Feature)         : http://localhost:30002"
                    echo "v3 (Filter/Sort Feature)  : http://localhost:30003"
                    echo "=========================================================="
                '''
            }
        }
    }

    post {
        always {
            echo 'Jenkins pipeline execution finished.'
        }
        success {
            echo 'SUCCESS: All 3 versions (v1, v2, v3) built, pushed to DockerHub, and deployed to Kubernetes!'
        }
        failure {
            echo 'FAILURE: Check logs above for errors.'
        }
    }
}
