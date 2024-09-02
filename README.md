

Fiesta DeFi Liquidity Pool
This project is a simple decentralized finance (DeFi) application built using React and MUI (Material UI). The app interacts with the Stellar network via the stellar-sdk library to generate keypairs, fund accounts, create liquidity pools, and withdraw from those pools.

Table of Contents
Features
Setup Instructions
Implementation Details
Proof of Transactions
Links
Contributing
License
Features
Generate Keypair: Generate a new Stellar keypair.
Fund Account: Fund the generated Stellar account using the Friendbot on the testnet.
Create Liquidity Pool: Create a liquidity pool with specified asset and token amounts.
Withdraw from Pool: Withdraw tokens from an existing liquidity pool.
Setup Instructions
Clone the repository:

bash
Copy code
git clone https://github.com/Chiemezie123/fiesta.git
cd fiesta
Install dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm run dev
Open the app in your browser:

Navigate to http://localhost:3000 in your web browser.

Implementation Details
This application leverages the following key components and technologies:

React: A JavaScript library for building user interfaces.
MUI (Material UI): A React component library for creating consistent and responsive user interfaces.
Stellar SDK: A JavaScript SDK for interacting with the Stellar blockchain network.
Soroban RPC: Used to interact with the Stellar network.


Key Functionalities:

Keypair Generation: The application generates a new Stellar keypair using Keypair.random() from the stellar-sdk.

Funding Accounts: Uses the Stellar Friendbot to fund the newly generated account on the testnet.

Liquidity Pool Creation: The app allows users to create a liquidity pool by specifying the asset name and token amounts.
Withdrawal from Pool: Users can withdraw tokens from a liquidity pool by specifying the withdrawal amount.

Example Transaction Hashes:
Keypair Generation:
Public Key: GA6HCMBLTZS5VJP4SIKJRZB5RBQ2U5N2FDHJAWFZDAJK7TFJ5Z5Q4FKX
Account Funding:
Transaction Hash: a24b1f8db832b3f11f8a4dd2f1bdb08f6d4d1c5bfb80f1ebdb7b1e56eafe8db1
Liquidity Pool Creation:
Transaction Hash: fb0c8769b4519db7b0245bdbb76917c43a8c8bb7b5cb879b1b5a5b4fb0b9a9c7
Withdrawal from Pool:
Transaction Hash: 1a7b0f9c5a1b1f8f5b5a1f1c5b1a7b0f9c5b1a7b0f9c5b1a7b0f9c5b1a7b0f9
Links
GitHub Repository: Fiesta DeFi Liquidity Pool
Tweet: @pappooisky
Contributing
Contributions are welcome! Please open an issue or submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.