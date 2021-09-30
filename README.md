# Pebble Loots

Pebble Loots is a managing and minting platform for Pebble Devices' loots. + Data charts

### [DEMO](https://youtu.be/0l6Tu4Eqo6A)
### [Website](https://www.pebble-loots.app)
### [Api Backend](https://github.com/nicky-ru/protoreader)

## Intro

Have you ever heard about Loot bags? If yes, you should feel comfortable here.
Pebble Loot platform helps you to mint and manage precious loots of real Pebble
devices and their Trusted data, moreover it provides a fundament for building
all sorts of creative apps for your Loots.

## Usage

### Mint

* Pebble Loots' smart contracts guarantee, that all the loots
are unique and can be minted only by the owner of the original device;

* You need to mint a Pebble Loot of your device firstly to be able to mint Trusted Data Loots;

* Your loots are minted on blockchain, it means you can access them outside of this Dapp too.

### Watch live Data

* In Loot charts application, which is accessible from the main page, you can see
the data streaming from your device online.

* (In work) If you like the data combination or you find some sensor values especially important,
you can mint Trusted Data Loot of specified sensors.

### Transfer your Loots

* Treat the Loots as usual NFTs, send them to your friends if you want them to access Data from your device.

Important! Transfer loots carefully. You won't be able to use apps build for Loots without any Loots in store.
Especially without Pebble Loots you will lose access to the data charts. A Pebble loot cannot be minted
twice for the same device.

### (In work) Redeem NFTs!

* Just use your Pebble tracker, mint Loots and get NFTs generated from Trusted Data Loots.

## Project Structure

![7121622212283_ pic](https://github.com/nicky-ru/pebble-loots/blob/3909a5b6348ae195281a1cad9bbac95b6c467cee/PLstructure.png)

Frontend and Smart contracts you can find in the current repo.
Backend is here [Api Backend](https://github.com/nicky-ru/protoreader)

## Prerequisites

- [Metamask](https://metamask.io/) plugin installed;
- Registered device on [IoTT Portal](https://app.iott.network/);

## Installation

Clone the repo and run `yarn install`

## Start

After the successful installation of the packages: `yarn start`

## Tests

### You can test Frontend with Cypress. You can run it with `yarn test`

### And Smart Contracts with Truffle. You can run it with `truffle test`
