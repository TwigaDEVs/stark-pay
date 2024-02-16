# stark-pay


# Stark-Pay Documentation
Access the live link provided at https://stark-pay.vercel.app/.

An application designed to facilitate payment transactions for services offered by users on the platform. Stark-Pay enables users to create services and receive payments from other users within the ecosystem using a checkout mechanism. This document provides an overview of the Stark-Pay application, its functionalities, and how users can interact with the platform.

## Technologies Used

Stark-Pay leverages the following technologies to provide a seamless and secure payment experience:

1. **StarkNet for Smart Contracts**: Stark-Pay utilizes StarkNet for the deployment and execution of its smart contracts, ensuring scalability, security, and efficiency in transaction processing.

2. **Argent Wallet Integration**: Users can utilize the Argent Wallet to make payments within the Stark-Pay platform. Through the Argent Wallet, users can securely manage their funds and initiate transactions with ease.

Users accessing Stark-Pay via mobile devices can conveniently scan the QR code associated with a service and proceed to checkout through the provided link. This integration enhances the user experience by enabling swift and efficient transactions on mobile devices.

3. **Braavos Wallet Integration**: Users can utilize the Braavos Wallet to make payments within the Stark-Pay platform. Through the Braavos Wallet, users can securely manage their funds and initiate transactions with ease.

4. **Price Feeds with Pragma Oracle**: Stark-Pay utilizes the Pragma Oracle to display price feeds within the platform. Price feeds provide users with real-time information on the value of assets and currencies, enhancing transparency and facilitating informed decision-making.

## Getting Started

To begin using Stark-Pay, users need to follow these initial steps:

- **Settlement Approval Code**: Users must first set and approve a code for settlements. This code enables the contract to perform transactions on behalf of the user. Users should provide the contract approval to execute transactions smoothly.

## Usage

### Creating a Service

Users can create services on Stark-Pay by following these steps:

1. Access the Stark-Pay platform.
2. Navigate to the service creation section.
3. Fill in the required details such as service name, charge, code, and number.
4. Submit the service creation request.

### Making a Checkout

To make a checkout for a service, users need to:

1. Select the desired service from the available options.
2. Specify the payment amount.
3. Initiate the checkout process.
4. Confirm the transaction.

### Settlement

Payment settlements within Stark-Pay are conducted using tokens. Users can settle payments through the designated token mechanism integrated into the platform.

## Running Locally

To run Stark-Pay locally, follow these steps:

1. Navigate to the client directory.
2. Run `npm run dev` to start the development server.
3. Access the live link provided at <https://stark-pay.vercel.app/>.

