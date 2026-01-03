# AurumNet Protocol

## Overview

AurumNet is an AI-managed capital infrastructure designed to optimize capital allocation across verified real-world assets (RWAs) and decentralized finance (DeFi) strategies. The protocol aims to enhance yield generation while ensuring compliance and risk management.

## Features

- **AI-Driven Capital Allocation**: Utilizes advanced algorithms to assess and allocate capital efficiently across various asset classes.
- **Unified RWA and DeFi Integration**: Seamlessly combines real-world and on-chain yield opportunities.
- **Emergency Risk Management**: Implements robust mechanisms to respond to market anomalies and safeguard assets.
- **Compliance-Friendly Architecture**: Designed to adhere to regulatory standards, ensuring a secure investment environment.

## Documentation

For detailed information about AurumNet, please refer to our [Documentation Library](./docs/README.md):

- **[Deployment Guide](./docs/deployment.md)**: Step-by-step instructions for deploying contracts, agent, and frontend.
- **[Core Concepts](./docs/concepts.md)**: Architecture diagrams and AI logic.
- **[User Scenarios](./docs/user-scenarios.md)**: Real-world use cases for retail and institutional users.
- **[Technical Architecture](./docs/architecture.md)**: Smart contract deep dive.

## Project Structure

The AurumNet project is organized into several key components:

- **Contracts**: Contains Solidity smart contracts for core functionalities, strategies, security, and interfaces.
- **AI Agent**: Implements the AI logic for capital allocation, including decision-making algorithms and configuration settings.
- **Frontend**: A user-friendly interface for interacting with the AurumNet protocol, built with TypeScript and React.
- **Scripts**: Deployment scripts for managing smart contracts on the blockchain.
- **Tests**: Automated tests to ensure the functionality and security of the smart contracts.

## Getting Started

For a complete setup, please follow the **[Deployment Guide](./docs/deployment.md)**.

### Quick Start (Frontend Only)

If you only want to run the frontend locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd aurumnet/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   npm install
   ```

3. Install AI agent dependencies:
   ```
   cd ai-agent
   pip install -r requirements.txt
   ```

4. Install Hardhat dependencies:
   ```
   cd contracts
   npm install
   ```

### Running the Project

- **Frontend**: Start the frontend application:
  ```
  cd frontend
  npm start
  ```

- **AI Agent**: Run the AI agent script:
  ```
  cd ai-agent/src
  python agent.py
  ```

- **Deploy Contracts**: Deploy the smart contracts to the blockchain:
  ```
  cd scripts
  npx hardhat run deploy.ts --network <network-name>
  ```

### Testing

Run the tests for the VaultCore contract:
```
cd test
npx hardhat test VaultCore.test.ts
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.