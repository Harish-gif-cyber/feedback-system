# Student Feedback System - DevOps CI/CD & Kubernetes Pipeline

**Roll Number:** `24MIS0031`  
**Project Name:** `Feedback System`  
**Institution:** VIT (Vellore Institute of Technology)  
**Lab Assignment:** Multi-Version Containerization & Kubernetes Orchestration  

---

## 📌 Project Overview & Version Breakdown

| Version | Feature | Description | Service / Port |
| :---: | :---: | :--- | :---: |
| **v1** | **Submit** | Enter and record student feedback with rating, course, and comments. | `http://localhost:30001` |
| **v2** | **View** | Submit feedback + dynamic live table displaying all submitted records. | `http://localhost:30002` |
| **v3** | **Filter & Sort** | Submit + View + filter by rating/course + sort by date/rating/name. | `http://localhost:30003` |

---

## 📁 Repository Structure

```text
feedback/
├── v1/                                 # Version 1: Submit Feedback
│   ├── public/
│   │   ├── index.html                  # Submission Form UI
│   │   └── style.css                   # V1 Styling
│   ├── server.js                       # Express Backend (POST /api/feedback)
│   ├── package.json
│   └── Dockerfile                      # Container definition for v1
├── v2/                                 # Version 2: View All Feedback
│   ├── public/
│   │   ├── index.html                  # Submit Form + Feedback List View UI
│   │   └── style.css
│   ├── server.js                       # Express Backend (POST & GET /api/feedback)
│   ├── package.json
│   └── Dockerfile                      # Container definition for v2
├── v3/                                 # Version 3: Filter & Sort Entries
│   ├── public/
│   │   ├── index.html                  # Form + View + Filter & Sort Controls
│   │   └── style.css
│   ├── server.js                       # Express Backend (Filtering, Sorting, Search)
│   ├── package.json
│   └── Dockerfile                      # Container definition for v3
├── k8s/                                # Kubernetes Manifests
│   ├── v1-deployment.yaml              # Deployment & NodePort (30001) for v1
│   ├── v2-deployment.yaml              # Deployment & NodePort (30002) for v2
│   ├── v3-deployment.yaml              # Deployment & NodePort (30003) for v3
│   └── feedback-all-in-one.yaml        # Single manifest for all 3 versions
├── Jenkinsfile                         # Declarative Jenkins CI/CD Pipeline
├── .gitignore
└── README.md
```

---

## 🚀 Step-by-Step Procedure

### Step 1: Open and Run Locally in VS Code

1. Open this workspace in **VS Code**:
   ```bash
   code c:\Users\vhari\OneDrive\Documents\feedback
   ```

2. Test any version locally:
   ```bash
   # Test Version 1 (Submit Feature)
   cd v1
   npm install
   npm start
   # Open browser: http://localhost:3000

   # Test Version 2 (Submit + View Feature)
   cd ../v2
   npm install
   npm start
   # Open browser: http://localhost:3000

   # Test Version 3 (Submit + View + Filter/Sort Feature)
   cd ../v3
   npm install
   npm start
   # Open browser: http://localhost:3000
   ```

---

### Step 2: Push to GitHub with Branches (v1, v2, v3)

1. Create a new GitHub repository named `feedback-system` on your GitHub account.
2. Link your local repo to GitHub:
   ```bash
   git remote add origin https://github.com/<your-github-username>/feedback-system.git
   ```
3. Push the `main` branch and dedicated version branches:
   ```bash
   # Push main branch
   git push -u origin main

   # Push v1, v2, v3 branches
   git push origin v1
   git push origin v2
   git push origin v3
   ```

---

### Step 3: Docker Containerization (Build & Tag v1, v2, v3)

Run the following commands in the root directory to build and tag all three versions:

```bash
# 1. Build and tag Version 1
docker build -t <dockerhub-username>/feedback-system:v1 ./v1

# 2. Build and tag Version 2
docker build -t <dockerhub-username>/feedback-system:v2 ./v2

# 3. Build and tag Version 3
docker build -t <dockerhub-username>/feedback-system:v3 ./v3

# Verify images created:
docker images | grep feedback-system
```

---

### Step 4: Push Images to Docker Hub

1. Login to Docker Hub:
   ```bash
   docker login
   ```
2. Push all three tagged versions:
   ```bash
   docker push <dockerhub-username>/feedback-system:v1
   docker push <dockerhub-username>/feedback-system:v2
   docker push <dockerhub-username>/feedback-system:v3
   ```

---

### Step 5: Setup & Run Jenkins Pipeline

1. Open Jenkins (`http://localhost:8080`).
2. Add your Docker Hub credentials in Jenkins:
   - Go to **Manage Jenkins** &rarr; **Credentials** &rarr; **System** &rarr; **Global credentials**.
   - Kind: `Username with password`
   - ID: `dockerhub-creds`
   - Username: `<your-dockerhub-username>`
   - Password: `<your-dockerhub-access-token-or-password>`
3. Create a **New Item**:
   - Name: `Feedback-System-Pipeline-24MIS0031`
   - Type: **Pipeline**
4. Under the **Pipeline** configuration section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/<your-github-username>/feedback-system.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
5. Click **Save** and select **Build Now**.
6. The Jenkins pipeline will automatically:
   - Checkout code
   - Lint & validate syntax
   - Build Docker images `v1`, `v2`, `v3`
   - Push to Docker Hub
   - Deploy to Kubernetes cluster
   - Verify deployment rollout status

---

### Step 6: Deploy to Kubernetes Cluster

You can deploy using the individual files or the all-in-one manifest:

```bash
# Deploy all three versions at once
kubectl apply -f k8s/feedback-all-in-one.yaml

# OR deploy individually:
kubectl apply -f k8s/v1-deployment.yaml
kubectl apply -f k8s/v2-deployment.yaml
kubectl apply -f k8s/v3-deployment.yaml
```

Check the status of pods, deployments, and services:
```bash
# Check Pods
kubectl get pods -l app=feedback-system

# Check Deployments
kubectl get deployments -l app=feedback-system

# Check Services and NodePorts
kubectl get services -l app=feedback-system
```

---

### Step 7: Access via Localhost (Different Ports)

All 3 versions are concurrently accessible on localhost:

| Version | Port / URL | Feature Displayed |
| :--- | :--- | :--- |
| **Version 1** | `http://localhost:30001` | Form to submit feedback with instant confirmation receipt |
| **Version 2** | `http://localhost:30002` | Submit form + Real-time table viewing all feedback submissions |
| **Version 3** | `http://localhost:30003` | Submit form + View table + Rating filter + Course filter + Sorting + Live search |

> **Note for Docker Desktop / Minikube users:**
> - On Docker Desktop for Windows, NodePort services map directly to `localhost:30001`, `localhost:30002`, `localhost:30003`.
> - If running on Minikube, execute:
>   ```bash
>   minikube service feedback-v1-service
>   minikube service feedback-v2-service
>   minikube service feedback-v3-service
>   ```
> - Alternatively, you can use Kubernetes port forwarding:
>   ```bash
>   kubectl port-forward service/feedback-v1-service 8081:3000
>   kubectl port-forward service/feedback-v2-service 8082:3000
>   kubectl port-forward service/feedback-v3-service 8083:3000
>   ```
