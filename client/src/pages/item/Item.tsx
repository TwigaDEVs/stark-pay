import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./item.css";
import creator from "../../assets/profile.png";
import item from "../../assets/item1.jpg";
import { useAppContext } from "../../providers/AppProvider";
import {
  bigintToLongStr,
  bigintToLongStrAddress,
  bigintToShortStr,
  encoder,
  generateShortWalletAddress,
  getRealPrice,
  TOKENS,
  Token
} from "../../config/utils";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import "w3-css/w3.css";
import { toast } from "react-toastify";
import { shortString } from "starknet";
import QRCode from 'qrcode.react';
import { CairoCustomEnum } from "starknet"

const Item: React.FC = () => {
  const { id } = useParams();
  const { account, contract,pragma_contract,address } = useAppContext();
  const [services, setServices] = useState<null | any>({});
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [code, setCode] = useState<null | any>();
  const [link, setLink] = useState('');
  const prices: { [pair_id: string]: number } = {};
  const [allPrices, setPrices] = useState({});
  console.log(pragma_contract);
  useEffect(() => {
    async function getService() {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      // console.log("this is the list");
      if (contract) {

        
        async function fetchPricesForTokens(tokens: Token[]): Promise<{ [pair_id: string]: number }> {
          const prices: { [pair_id: string]: number } = {};
      
          // Create an array of promises for fetching prices
          const pricePromises: Promise<void>[] = tokens.map(async (token) => {
              const SPOTENTRY_ENUM = new CairoCustomEnum({
                  SpotEntry: token.pair_id
              });
      
              try {
                  const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM);
                  const the_price = getRealPrice(res); // Assuming getRealPrice() is defined elsewhere
                  prices[token.pair_id] = the_price.price; // Assuming getRealPrice() is synchronous
              } catch (error) {
                  console.error(`Error fetching data for token ${token.pair_id}:`, error);
              }
          });
      
          // Wait for all promises to resolve
          await Promise.all(pricePromises);
      
          return prices;
      }
  

      try {
        const tokenPrices = await fetchPricesForTokens(TOKENS);
            console.log("Token Prices:", tokenPrices);
            setPrices(tokenPrices)
        } catch (error) {
            console.error("Error:", error);
        }
        
        const result = await contract.get_all_services();
        const data = result.filter((r: any) => {
          return r.service_id.toString() == id;
        });
        const singleService = data[0];
        setServices(singleService);
        setLink(`https://stark-pay.vercel.app/service/${id}`)

      }
      // contract ? console.log(contract) : "contract not yet loaded";
    }
    getService();
  }, [contract,setPrices]);

  const handleCheckout = async () => {
    if (account) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      const result = await contract.checkout(
        Number(id),
        code
      );
      console.log(result);
      // toast.success("transaction executed successfull!");
    }
    setModalIsOpened(false);
  };

  const tableRows = Object.keys(allPrices).map((currencyPair, index) => (
    <tr key={index}>
      <td>{currencyPair}</td>
      <td>{(allPrices as {[key: string]: any})[currencyPair]}</td>
    </tr>
  ));

  return (
    <div className="item section__padding">
      <div className="item-image">
        <QRCode value={link} size={200}/>
      </div>
      {modalIsOpened && (
        <div className="w3-modal" style={{ display: "block" }}>
          <div className="w3-modal-content w3-padding">
            <div className="w3-container">
              <p>Service: {services.service_name && bigintToShortStr(services.service_name)}</p>
              <div className="formGroup">
                <label>code</label>
                <input
                  type="password"
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  autoFocus={true}
                />
              </div>
              <button
                onClick={handleCheckout}
                className="w3-button w3-round w3-text-white w3-border w3-green"
              >
                Proceed
              </button>
              <button
                className="w3-button w3-round w3-red w3-right"
                onClick={() => {
                  setModalIsOpened(false);
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="item-content">
        <div className="item-content-title">
          <h1>
            {services.service_name && bigintToShortStr(services.service_name)}
          </h1>
          <p>
            Price{" "}
            <span className="w3-text-green">{services.charge && services.charge.toString()} STP</span>
          </p>
        </div>
        <div className="item-content-creator">
          <div>
            <p>Seller</p>
          </div>
          <div>
            <img src={creator} alt="creator" />
            <p>{services.owner && generateShortWalletAddress(bigintToLongStrAddress(services.owner))}... </p>
          </div>
        </div>
        <br />
          <h5 className="w3-text-green">Price Feeds</h5>
          <table className="w3-table ">
          <thead>
            <tr className="w3-green">
              <th>Currency Pair</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className="w3-text-white">
            {tableRows}
          </tbody>
        </table>
        <br />
        <div className="item-content-buy">
          <Button
            className="primary-btn"
            onClick={() => {
              setModalIsOpened(true);
            }}
          >
            check out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Item;
