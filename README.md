# XOPTS

<div align="center">
	<p align="center">
		<img src="src/assets/img/xopts.png" alt="logo" width="128" height="128">
	</p>
	<p>
		<h3 align="center">XOPTS: Trustless, Non-Custodial Bitcoin Options on Ethereum</h3>
		<h4 align="center">Live at: <a href="https://xopts.io" target="__blank">xopts.io</a></h5>
		<h5 align="center">Status: Testnet (Ropsten) </h5>
	</p>
</div>


## About

In traditional finance, an [option](https://en.wikipedia.org/wiki/Option_(finance)) enables the owner to buy or sell an underlying asset at a specified conversion rate before an expiration date.
XOPTS extends the native capabilities of Ethereum to track and execute PUT Options against BTC. Specifically, we enable sellers to lock DAI collateral in a contract to mint ERC-20 compatible option
tokens that can be traded on [Uniswap](https://uniswap.org/). Buyers can then insure an arbitrary amount of BTC relative to the contract's strike price and pay in an amount of DAI collateral as premium.
Finally, options can be exercised once the buyer proves payment to the respective underwriters of that contract using an on-chain Bitcoin SPV client.

### Built with

* [Yarn](https://yarnpkg.com/)
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [Bootstrap](https://getbootstrap.com/)

## Getting started

Clone the repository, install the dependencies and start the react app.

```bash
git clone git@gitlab.com:interlay/xopts-ui.git
yarn install
yarn start
```

Make sure you have a web-wallet like [MetaMask](https://metamask.io/) installed to connect to Ethereum. You should also have a Bitcoin wallet connected to the testnet in case you would like to exercise an option. You can use [Bitcoin's wallet selector](https://bitcoin.org/en/choose-your-wallet) to help you choose.

We are live on the Ropsten testnet. Make sure to point MetaMask to Ropsten to interact with XOpts!

### Development

If you would like to get started developing on XOpts, easiest would be to set-up a local development environment that includes the smart contracts as well.
Check out the [XOpts smart contracts repository to get started with a development environment](https://gitlab.com/interlay/xopts).

## Contributing

If you would like to contribute, please file an issue on Github or reach out to us.

- [Telegram](t.me/interlay)
- [Riot](https://matrix.to/#/!nZablWWaicZyVTWyZk:matrix.org?via=matrix.org)

We are [hiring](https://www.interlay.io/careers/)!

## License

(C) Copyright 2020 [Interlay](https://www.interlay.io) Ltd

XOPTS is licensed under the terms of the Apache License (Version 2.0). See [LICENSE](LICENSE).

## Contact

Website: [Interlay.io](https://www.interlay.io)

Twitter: [@interlayHQ](https://twitter.com/InterlayHQ)

Email: contact@interlay.io
