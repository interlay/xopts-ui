import {ethers, XOpts} from "@interlay/xopts";
import {Signer, Provider, SignerOrProvider} from "@interlay/xopts/dist/lib/core";

class Globals {
    private _xopts: XOpts<SignerOrProvider> | undefined;
    private _provider: ethers.providers.Provider | undefined;

    set xopts(xopts: XOpts<SignerOrProvider>) {
        this._xopts = xopts;
    }

    get xopts(): XOpts<SignerOrProvider> {
        return this._xopts as XOpts<SignerOrProvider>;
    }

    get xoptsRW(): XOpts<Signer> {
        return this._xopts as XOpts<Signer>;
    }

    set provider(provider: ethers.providers.Provider) {
        this._provider = provider;
    }

    get provider(): ethers.providers.Provider {
        return this._provider as ethers.providers.Provider;
    }

    get web3Provider(): ethers.providers.Web3Provider {
        return this._provider as ethers.providers.Web3Provider;
    }

    get signer(): ethers.Signer {
        return (this._provider as ethers.providers.Web3Provider).getSigner();
    }

    get metamaskProvider(): any {
        return (this._provider as ethers.providers.Web3Provider).provider;
    }
}

const globals = new Globals();
export default globals;
