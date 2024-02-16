import { shortString } from "starknet"
import { BigNumber } from "bignumber.js"


export function isDarkMode(colorscheme: string) {
    return colorscheme === 'dark' ? true : false
}

export function limitChars(str: string, count: number, show_dots: any) {
    if (count <= str.length) {
        return `${str.substring(0, count)} ${show_dots ? '...' : ''}`
    }
    return str
}

export function bigintToShortStr(bigintstr: BigNumber.Value) {
    if (!bigintstr) return ""
    const bn = BigNumber(bigintstr)
    const hex_sentence = `0x` + bn.toString(16)

    return shortString.decodeShortString(hex_sentence)
}

export function convertToReadableTokens(tokens: BigNumber.Value, decimals: number) {
    if (!tokens || !decimals) return ""
    return new BigNumber(tokens).dividedBy(10 ** decimals).toNumber().toFixed(6)
}

export function bigintToLongStrAddress(bigintstr: BigNumber.Value) {
    if (!bigintstr) return ""
    const bn = BigNumber(bigintstr)
    const hex_sentence = `0x` + bn.toString(16)
    return hex_sentence;
}


export function bigintToLongStr(bigintstr: BigNumber.Value) {
    if (!bigintstr) return ""
    const bn = BigNumber(bigintstr)
    const hex_sentence = bn.toString(16)
    return hex_sentence;
}

export function bnCompare(bn: BigNumber.Value, b: string) {
    return BigNumber(bn).toString() === b
}

export function timeStampToDate(timestamp: number) {
    if(!timestamp) return null
    const timestampInMilliseconds = timestamp * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
}


export function getTwoAddressLetters(address: string){
    if (!address) return "0x"
    return  address?.substring(0, 4).substring(2, 4) ?? "0x"
}

export const encoder = (str: string) => {
    return shortString.encodeShortString(str);
}


export const  generateShortWalletAddress = (bigintValueStr: string) => {
    // Convert BigInt value to a string
    let strValue = bigintValueStr;


    return strValue.slice(0, 8); // Return the first 8 characters
}

export interface Token {
    name: string
    symbol: string
    decimals: number
    address: string
    pair_id: string
    icon: string
}

export function getRealPrice(val: any) {
    let decimals = BigNumber(val.decimals).toNumber()
    let ts = BigNumber(val.last_updated_timestamp).toNumber()
    let real_price = {
        price: BigNumber(val.price).dividedBy(10 ** decimals).toNumber(),
        last_updated_timestamp: timeStampToDate(ts),
        num_sources_aggregated: BigNumber(val.num_sources_aggregated).toNumber()
    }
    return real_price
}

export const  TOKENS: Token[] = [
    {
        name: 'Ethereum',
        decimals: 18,
        address: '0x49D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7',
        pair_id: 'ETH/USD',
        symbol: 'ETH',
        icon: 'https://cryptocurrencyliveprices.com/img/eth-ethereum.png'
    },
    {
        name: 'Bitcoin',
        decimals: 8,
        address: '0x12d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56',
        pair_id: 'BTC/USD',
        symbol: 'BTC',
        icon: 'https://cryptocurrencyliveprices.com/img/btc-bitcoin.png'
    },
    {
        name: 'USDC',
        decimals: 6,
        address: '0x001d5b64feabc8ac7c839753994f469704c6fabdd45c8fe6d26ed57b5eb79057',
        pair_id: 'USDC/USD',
        symbol: 'USDC',
        icon: 'https://cryptocurrencyliveprices.com/img/eth-ethereum.png'
    },
    {
        name: 'USDT',
        decimals: 6,
        address: '0x386e8d061177f19b3b485c20e31137e6f6bc497cc635ccdfcab96fadf5add6a',
        pair_id: 'DAI/USD',
        symbol: 'USDT',
        icon: 'https://cryptocurrencyliveprices.com/img/usdt-tether.png'
    },
    {
        name: 'Dai Stable Coin',
        decimals: 18,
        address: '0x0278f24c3e74cbf7a375ec099df306289beb0605a346277d200b791a7f811a19',
        pair_id: 'DAI/USD',
        symbol: 'DAI',
        icon: 'https://cryptocurrencyliveprices.com/img/dai-dai.png'
    }
]