# Micro-Frontend (MFE) Remote Architecture Blueprint

This template defines an isolated micro-frontend module that follows DDFM principles and exposes components to the Host.

## Usage
1. Configure `exposes` in Webpack 5 to share specific domain components.
2. Develop using the local Sandbox (`npm run sandbox`) to ensure pixel-perfect visual regression before CI/CD.
3. Maintain isolated state management to avoid cross-module pollution.
