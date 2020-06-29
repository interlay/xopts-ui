import { StorageInterface, PersistentStorage } from "./Storage";
import { BitcoinInterface } from "./Bitcoin";
import { ContractsInterface } from "./Contracts";

export interface AppState {
  isWeb3: boolean
  isLoggedIn: boolean
  address: string
  btcProvider: BitcoinInterface
  contracts?: ContractsInterface
  storage: StorageInterface
  persistenStorage: PersistentStorage
  btcPrices: {
    dai: number
    usd: number
    eth: number
  }
  daiPrices: {
    usd: number
    eth: number
  }
}

export interface AppPropsLoading extends AppState {
  tryLogIn: (activeLogin: boolean) => Promise<void>
}

export interface AppProps extends AppPropsLoading {
  contracts: ContractsInterface
}
