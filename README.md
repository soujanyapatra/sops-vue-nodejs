# Secure DevSecOps Secret Management Demo (SOPS + AGE + GitHub Actions)

A complete production-quality, full-stack demonstration project showing how secrets can be stored encrypted in Git, decrypted safely during CI/CD, and used by a Node.js Express backend without ever exposing them to the client-side Vue 3 application.

---

## 🏗️ Architecture Overview

The following diagram illustrates the lifecycle of secrets from local development to production deployment:

```mermaid
graph TD
    subgraph "Local Developer Machine"
        Dev[Developer] -->|age-keygen| KeyPair["AGE Keys: public/private"]
        Dev -->|"1. Create plain secrets"| Sec["secrets/secrets.yaml"]
        Dev -->|"2. SOPS Encrypt"| EncSec["secrets/secrets.enc.yaml"]
    end

    subgraph "Version Control (GitHub)"
        EncSec -->|"3. Commit encrypted yaml only"| GitRepo["Git Repository"]
        GitIgnore["gitignore ignores secrets.yaml and age-key.txt"]
    end

    subgraph "CI/CD Runner (GitHub Actions)"
        GitRepo -->|"4. Trigger workflow"| GHA["GitHub Actions"]
        GHAKey["GitHub Secret: AGE_PRIVATE_KEY"] -->|"5. Restore Private Key"| GHA
        GHA -->|"6. SOPS Decrypt"| DecEnv["backend/.env"]
        GHA -->|"7. Run Tests and Lint"| Build["Compile TS and Bundle Vue"]
    end

    subgraph "Cloud Deployment"
        Build -->|"8. Deploy FE"| Vercel["Vercel Frontend"]
        Build -->|"9. Deploy BE"| Railway["Railway/Render Backend"]
        Vercel -->|"10. Call API: /api/secret-status"| Railway
    end

    classDef secure fill:#065f46,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef danger fill:#7f1d1d,stroke:#f87171,stroke-width:2px,color:#fff;
    class GHAKey,DecEnv,KeyPair secure;
    class Sec,GitIgnore danger;
```

---

## 🔒 Security Principles

### 1. Why Not Store `.env` Files in Git?
Storing raw `.env` or plaintext configuration files in Git is a major security vulnerability:
- **Exposed History**: Once a secret is pushed to a Git repository, it remains in the Git commit history forever. Deleting the file in a new commit does not remove it from past commits.
- **Accidental Public Exposure**: Public repositories expose keys instantly to crawlers. Private repositories are also vulnerable to credential harvesting by compromised developer accounts, rogue third-party packages, or data breaches.
- **Lack of Access Controls**: Git repositories do not support granular access control on file paths. Anyone with read access to the code has full access to production database credentials, API keys, and certificates.

### 2. How Mozilla SOPS Works
**SOPS (Secrets Operations)** is an editor/CLI tool that encrypts YAML, JSON, ENV, INI, and BINARY files. 
- It encrypts the **values** of the configuration keys while leaving the **keys themselves unencrypted**. This allows developers to read the structure of the config file and review git diffs easily.
- It uses envelope encryption. The data is encrypted with a localized data key, and that data key is then encrypted using one or more master keys (like AGE, AWS KMS, GCP KMS, Vault, or PGP).

### 3. How AGE Works
**AGE (Actually Good Encryption)** is a modern, simple, and secure file encryption tool, designed to replace GPG/PGP.
- It uses small, lightweight keys (X25519 public keys and X25519 private keys).
- It is extremely fast and has no complex keyring configurations.
- Because it is standard and simple, it is highly suitable for automated pipelines and DevOps container integration.

---

## 📁 Project Structure

```text
project-root/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline configuration
├── backend/
│   ├── src/                # Express TypeScript source code
│   │   ├── app.ts          # Core application & routing
│   │   ├── index.ts        # Server entry point
│   │   └── app.test.ts     # Jest backend integration tests
│   ├── Dockerfile          # Production backend Docker configuration
│   ├── jest.config.js      # Jest config
│   ├── tsconfig.json       # Backend TypeScript config
│   └── package.json        # Backend dependencies & scripts
├── frontend/
│   ├── src/
│   │   ├── plugins/
│   │   │   └── vuetify.ts  # Vuetify config & design styling
│   │   ├── router/
│   │   │   └── index.ts    # Frontend routing definitions
│   │   ├── views/          # Views: Home, SecretStatus, Pipeline
│   │   │   ├── HomeView.vue
│   │   │   ├── SecretStatusView.vue
│   │   │   └── PipelineView.vue
│   │   ├── App.vue         # Main layout shell
│   │   └── main.ts         # Vue entry point
│   ├── Dockerfile          # Frontend SPA Nginx Docker configuration
│   ├── vite.config.ts      # Vite & Vitest config
│   ├── tsconfig.json       # Frontend TypeScript config
│   └── package.json        # Frontend dependencies & scripts
├── secrets/
│   ├── secrets.yaml        # Plaintext local secrets (ignored by Git)
│   └── secrets.enc.yaml    # Encrypted secrets (safe to commit to Git)
├── bin/                    # Downloaded SOPS & AGE binaries (local only)
├── .gitignore              # Protects secrets.yaml, age-key.txt, and .env
├── .sops.yaml              # SOPS encryption mapping configuration
├── docker-compose.yml      # Multi-container local execution setup
├── package.json            # Root workspace scripts (orchestrator)
└── README.md               # Main project documentation
```

---

## 🛠️ Step-by-Step Local Setup & Commands

### Prerequisites
- Node.js v20.x
- npm

### 1. Download Local SOPS & AGE Binaries
If you don't have SOPS and AGE installed on your system, you can fetch them inside the project using:
```bash
# Create local bin folder and download binaries
mkdir -p bin
curl -LO "https://github.com/getsops/sops/releases/download/v3.9.0/sops-v3.9.0.linux.amd64" && mv sops-v3.9.0.linux.amd64 bin/sops && chmod +x bin/sops
curl -LO "https://dl.filippo.io/age/latest?for=linux/amd64" && tar -xzf latest?for=linux%2Famd64 -C bin --strip-components=1 && chmod +x bin/age bin/age-keygen
```

### 2. Generate AGE Keypair
```bash
bin/age-keygen -o age-key.txt
```
This generates a private key (stored in `age-key.txt`) and outputs a public key matching:
`public key: age1...`

### 3. Update `.sops.yaml`
Add your public key to `.sops.yaml` creation rules:
```yaml
creation_rules:
  - path_regex: secrets/.*\.yaml$
    age: <your-public-key-here>
```

### 4. Create Secrets
Create your local plaintext config file in `secrets/secrets.yaml`:
```yaml
API_KEY: super-secret-demo-key
ENVIRONMENT: development
NEWS_API_AI_KEY: 9bcf2d37-8a60-4e80-b776-04c3cced79c9
```

### 5. Encrypt Secrets
```bash
bin/sops --encrypt secrets/secrets.yaml > secrets/secrets.enc.yaml
```
Verify that `secrets.enc.yaml` contains encrypted values and metadata blocks.

### 6. Decrypt Secrets (Generate `.env` for Development)
To run local development servers, decrypt the configuration into a `.env` file:
```bash
SOPS_AGE_KEY_FILE=age-key.txt bin/sops --decrypt secrets/secrets.enc.yaml > backend/.env
```
*(Alternatively, you can run: `SOPS_AGE_KEY="<private-key-string>" bin/sops --decrypt secrets/secrets.enc.yaml > backend/.env`)*

### 7. Run the Application Locally
Install all dependencies and run dev servers:
```bash
# Install root, frontend, and backend packages
npm run install-all

# Boot development mode (runs backend on port 3000, frontend on port 5173/vite)
npm run dev
```

### 8. Run All Test Suites
Verify all backend Jest integration tests and frontend component tests:
```bash
npm run test
```

---

## 🐳 Docker Compose Local Testing

To test the full containerized stack locally matching production topologies:

1. Decrypt the secrets to the backend directory:
   ```bash
   SOPS_AGE_KEY_FILE=age-key.txt bin/sops --decrypt secrets/secrets.enc.yaml > backend/.env
   ```
2. Build and launch containers:
   ```bash
   docker compose up --build
   ```
3. Access the services:
   - **Frontend UI**: `http://localhost:8080`
   - **Backend API**: `http://localhost:3000/api/health`

---

## 🚀 GitHub Actions Setup (CI/CD)

To configure the deployment pipeline:
1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Create a secret named **`AGE_PRIVATE_KEY`** and paste the raw content of your private key (from `age-key.txt`, e.g., `AGE-SECRET-KEY-1D37...`).
4. (Optional) Create a secret named **`VERCEL_TOKEN`** for frontend hosting deployments.
5. Push your code (ensuring `.gitignore` blocks `secrets.yaml` and `age-key.txt`). The pipeline will run, restore the keys, decrypt `secrets.enc.yaml`, write `backend/.env`, and verify tests.

---

## 🔒 Security Considerations & Common Mistakes

- **Mistake: Committing the `age-key.txt` file.** 
  *Fix:* Double check that `age-key.txt` is listed in your root `.gitignore` before initializing Git.
- **Mistake: Committing the decrypted `.env` file.**
  *Fix:* Ensure `.env` is explicitly ignored at the root and folder level.
- **Mistake: Exposing `process.env.API_KEY` directly to the client.**
  *Fix:* Never create endpoints like `GET /api/get-keys` that return plain values. Only return structural states (e.g. `secretLoaded: true`).
- **Mistake: Using frontend environment variables (`VITE_API_KEY`) for backend API secrets.**
  *Fix:* Vite bundles variables starting with `VITE_` directly into the client-side JavaScript, rendering them viewable to anyone using browser inspector tools. Keep all master credentials on the backend.
