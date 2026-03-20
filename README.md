# 🌸 MoonBloom - Backend & Frontend Setup

Aplicación web para el seguimiento del ciclo menstrual desarrollada como proyecto de la materia **Tecnologías de Desarrollo en el Servidor**.

---

# 🚀 Requisitos

Antes de iniciar asegúrate de tener instalado:

* Node.js
* npm
* Git

---

# 📦 Clonar el repositorio

```bash
git clone https://github.com/Frijol75/TechServerProyect.git
cd TechServerProyect
```

---

# 🧑‍💻 Backend Setup

## 📁 Entrar al backend

```bash
cd backend
```

## 📦 Instalar dependencias

```bash
npm install
```

## 🔐 Configurar variables de entorno

Crear archivo `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/moonbloom
```

---

## ▶️ Ejecutar servidor

```bash
node src/app.js
```

o (si agregaste script):

```bash
npm run dev
```

---

## ✅ Verificar funcionamiento

Abrir en navegador:

```
http://localhost:3000/
```

También:

```
http://localhost:3000/health
```

---

# 🌐 Endpoints base

| Método | Ruta       | Descripción         |
| ------ | ---------- | ------------------- |
| GET    | /          | Verificar servidor  |
| GET    | /health    | Estado del servidor |
| GET    | /api/users | Obtener usuarios    |
| POST   | /api/users | Crear usuario       |

---

# 🎨 Frontend Setup

## 📁 Entrar al frontend

```bash
cd ../frontend
```

## 📦 Instalar dependencias

```bash
npm install
```

## ▶️ Ejecutar aplicación

```bash
npm start
```

---

## 🌐 Ver en navegador

```
http://localhost:3000
```

---

# 🧠 Estructura del Proyecto

```
moonbloom/
 ├── backend/
 │    ├── src/
 │    │    ├── models/
 │    │    ├── controllers/
 │    │    ├── routes/
 │    │    ├── config/
 │    │    └── app.js
 │
 ├── frontend/
 │    ├── src/
 │    │    ├── components/
 │    │    ├── pages/
 │    │    └── App.js
```

---

# ⚙️ Tecnologías

### Backend

* Node.js
* Express
* MongoDB
* Mongoose

### Frontend

* React
* JavaScript
* CSS

---

# 📋 Sprint 1 - Alcance

En este sprint se implementó:

* Configuración del backend
* Conexión a base de datos
* Estructura MVC
* Rutas base
* Mockup del frontend
* Configuración del repositorio

---

# 🔄 Próximos pasos (Sprint 2)

* CRUD completo de usuarios
* CRUD de ciclos y registros
* Conexión frontend-backend
* Autenticación básica

---

# 👥 Equipo

* Backend Base
* Arquitectura (MVC)
* Diseño (Base de Datos)

---

# 💡 Notas

* No subir `node_modules`
* Usar commits claros
* Mantener estructura organizada

---

# 🟢 Estado del proyecto

🚧 En desarrollo (Sprint 1 completado)
