# E-Summit 2026 - DevOps & Infrastructure Guide

This document contains the end-to-end operational guide, deployment workflows, environment setup, and pending tasks for DevOps and Infrastructure engineers.

---

## 1. System Architecture

```
[ DNS / Cloudflare Proxy ]
            |
            v
   [ VPS Server (Nginx) ]
     |-- Port 80/443 (SSL termination via Certbot)
     |
     +---> localhost:3000 -> Frontend Container (Next.js 15)
     +---> localhost:3001 -> Admin Dashboard Container (Next.js 16)
     +---> localhost:4000 -> Backend API Container (NestJS)
                                  |
                                  v
                        [ MongoDB Atlas Cloud ]
```

---

## 2. Infrastructure TODO Checklist

### A. VPS Provisioning
- [ ] Provision Ubuntu 22.04 or 24.04 LTS VPS (recommended: 2 vCPU, 4GB RAM).
- [ ] Install Docker & Docker Compose plugin:
  ```bash
  sudo apt update && sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
  sudo usermod -aG docker $USER
  ```
- [ ] Enable firewall with SSH, HTTP, and HTTPS:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

---

### B. Domain & Nginx Setup
- [ ] Point DNS A Records to VPS IP:
  * `esummit.pec.ac.in` -> `<VPS_IP>`
  * `admin.esummit.pec.ac.in` -> `<VPS_IP>`
  * `api.esummit.pec.ac.in` -> `<VPS_IP>`
- [ ] Copy Nginx configuration:
  ```bash
  sudo cp nginx/esummit.conf /etc/nginx/sites-available/esummit.conf
  sudo ln -s /etc/nginx/sites-available/esummit.conf /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```
- [ ] Generate SSL certificates:
  ```bash
  sudo certbot --nginx -d esummit.pec.ac.in -d admin.esummit.pec.ac.in -d api.esummit.pec.ac.in
  ```

---

### C. Environment Secrets Setup
- [ ] On VPS, create `backend/.env`:
  ```bash
  cp backend/.env.example backend/.env
  ```
- [ ] Generate unique 64-character hex keys for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `QR_HMAC_SECRET`:
  ```bash
  openssl rand -hex 32
  ```
- [ ] Set `CORS_ORIGINS`:
  ```env
  CORS_ORIGINS=https://esummit.pec.ac.in,https://admin.esummit.pec.ac.in
  ```
- [ ] Set `DATABASE_URL` with MongoDB Atlas connection string.

---

### D. Third-Party Integrations
- [ ] **Razorpay Live Gateway**: Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in `backend/.env`.
- [ ] **Cloudinary Media Storage**: Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` (or `CLOUDINARY_URL`) for speaker avatars and event media.


---

### E. GitHub Actions Auto-Deploy Secrets
In your GitHub Repository (`Settings -> Secrets and variables -> Actions`), add:

| Secret Name | Description |
| :--- | :--- |
| `VPS_HOST` | Public IP Address of the VPS |
| `VPS_USERNAME` | SSH username (e.g. `ubuntu` or `root`) |
| `VPS_SSH_KEY` | Private SSH key for server authentication |
| `VPS_PORT` | SSH port (default: 22) |

---

## 3. Manual Deployment Commands

To build and run all services manually:
```bash
# Build and start all containers in background
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Check container status
docker compose ps

# Stop all containers
docker compose down
```

To re-seed or update database schema on MongoDB:
```bash
# Sync schema and indexes
docker compose exec backend npx prisma db push

# Re-run master CMS seed script
docker compose exec backend npm run seed
```

---

## 4. Health Checks and Monitoring

- Public Health Check: `curl -I https://api.esummit.pec.ac.in/api/v1/health`
- Expected response: `HTTP/1.1 200 OK` with `{"status":"ok"}`
- Log location: `docker compose logs --tail=100 backend`
