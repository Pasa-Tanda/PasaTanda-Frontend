# PasaTanda - Smart Contracts Soroban

![Stellar](https://img.shields.io/badge/Stellar-Soroban-blue)
![Rust](https://img.shields.io/badge/Rust-1.74+-orange)
![Status](https://img.shields.io/badge/Status-Deployed%20on%20Testnet-green)

Sistema de ahorro colaborativo (Tandas/Pasanakus) en Stellar con **generación automática de rendimiento** a través del protocolo Blend.

## 🚀 Contratos Desplegados en Testnet

**Factory Address**: `CCYLAWPJM6OVZ222HLPZBE5VLP5HYS43575LI4SCYMGC35JFL2DQUSGD`  
**Group WASM Hash**: `091f6b66a1bf7192bff0ec84e32c5f2f32c4c77ef1bd742a6d3b8d2a67804ea6`

[Ver detalles completos →](DEPLOYED_CONTRACTS.md)

---

## 🎯 Características Principales

- ✅ **Auto-Inversión**: Los depósitos se invierten automáticamente en Blend Pool
- ✅ **Distribución Configurable**: Define qué % del yield va a usuarios vs. plataforma
- ✅ **Factory Pattern**: Despliegue estandarizado de grupos
- ✅ **Seguridad Multi-Capa**: Autorización granular, validaciones on-chain
- ✅ **Event-Driven**: Sincronización backend mediante eventos

## 📁 Estructura del Proyecto

```
pasatanda-soroban-contracts/
├── contracts/
│   ├── pasanaku-factory/       # ✅ Desplegado en Testnet
│   └── pasanaku-group/         # ✅ WASM instalado
├── DEPLOYED_CONTRACTS.md       # 🆕 Info de despliegue
├── DOCUMENTATION.md            # Documentación técnica completa
├── DEPLOYMENT.md               # Guía de despliegue
└── README.md                   # Este archivo
```

## 🔗 Enlaces Útiles

- **Stellar Expert**: [Ver Factory en Explorer](https://stellar.expert/explorer/testnet/contract/CCYLAWPJM6OVZ222HLPZBE5VLP5HYS43575LI4SCYMGC35JFL2DQUSGD)
- **Stellar Lab**: [Interactuar con el contrato](https://lab.stellar.org/r/testnet/contract/CCYLAWPJM6OVZ222HLPZBE5VLP5HYS43575LI4SCYMGC35JFL2DQUSGD)

## ⚡ Quick Start

### Verificar Despliegue

```bash
# Verificar Factory
stellar contract invoke \
  --id CCYLAWPJM6OVZ222HLPZBE5VLP5HYS43575LI4SCYMGC35JFL2DQUSGD \
  --source bmstellar \
  --network testnet \
  -- \
  get_total_groups
```

### Crear un Grupo

Ver [DEPLOYED_CONTRACTS.md](DEPLOYED_CONTRACTS.md) para el comando completo.

## 📖 Documentación

- **[DEPLOYED_CONTRACTS.md](DEPLOYED_CONTRACTS.md)**: Información de contratos desplegados
- **[DOCUMENTATION.md](DOCUMENTATION.md)**: Documentación técnica completa
  - Arquitectura del sistema
  - Diagramas de flujo (Mermaid)
  - Guía de integración para Backend
  - Explicación línea a línea del código
  
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Guía de despliegue paso a paso

## 🔗 Integración con Blend

El sistema utiliza el protocolo Blend para generar rendimiento automáticamente sobre los fondos depositados.

```rust
// Auto-inversión en Blend
pool_client.submit(SupplyCollateral, amount);

// Retiro con intereses
pool_client.submit(WithdrawCollateral, MAX);
```

## 🎯 Próximos Pasos

1. ✅ ~~Desplegar en Testnet~~ **COMPLETADO**
2. ⏳ Obtener Pool de Blend en Testnet
3. ⏳ Crear grupo de prueba
4. ⏳ Testing end-to-end
5. ⏳ Integración Backend

## 📞 Soporte

- **Documentación Soroban**: https://soroban.stellar.org
- **Documentación Blend**: https://docs.blend.capital
- **Stellar Developer Discord**: https://discord.gg/stellar

---

**Desarrollado para Stellar Soroban** | **Powered by Blend Protocol**  
**Status**: ✅ **Desplegado en Testnet**
