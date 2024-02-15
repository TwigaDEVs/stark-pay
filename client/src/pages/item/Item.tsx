import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./item.css";
import creator from "../../assets/profile.png";
import item from "../../assets/item1.jpg";
import { useAppContext } from "../../providers/AppProvider";
import {
  bigintToLongStrAddress,
  bigintToShortStr,
  encoder,
} from "../../config/utils";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import "w3-css/w3.css";
import { toast } from "react-toastify";
import { shortString } from "starknet";

const Item: React.FC = () => {
  const { id } = useParams();
  const { account, contract } = useAppContext();
  const [services, setServices] = useState<null | any>({});
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [serviceHash, setServiceHash] = useState<null | any>("");
  const [code, setCode] = useState<null | any>();
  useEffect(() => {
    async function getService() {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      // console.log("this is the list");
      if (contract) {
        const result = await contract.get_all_services();
        const data = result.filter((r: any) => {
          return r.service_id.toString() == id;
        });
        const singleService = data[0];
        setServices(singleService);
        const getHash = await contract.get_service_hash(id);
        setServiceHash(getHash);
      }
      // contract ? console.log(contract) : "contract not yet loaded";
    }
    getService();
  }, [contract, serviceHash]);

  const handleCheckout = async () => {
    if (account) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      console.log(bigintToShortStr(serviceHash));
      const result = await contract.checkout(
        bigintToShortStr(serviceHash),
        code
      );
      console.log(result);
      // toast.success("transaction executed successfull!");
    }
  };

  console.log(serviceHash && serviceHash);
  return (
    <div className="item section__padding">
      {/* <div className="item-image">
        <img src={item} alt="item" />
      </div> */}
      {modalIsOpened && (
        <div className="w3-modal" style={{ display: "block" }}>
          <div className="w3-modal-content w3-padding">
            <div className="w3-container">
              <p>serviceHash: {serviceHash && serviceHash.toString()}</p>
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
                className="w3-button w3-round w3-text-green w3-border w3-border-green"
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
            price{" "}
            <span>{services.charge && services.charge.toString()} STP</span>
          </p>
        </div>
        <div className="item-content-creator">
          <div>
            <p>Seller</p>
          </div>
          <div>
            <img src={creator} alt="creator" />
            <p>{services.owner && bigintToLongStrAddress(services.owner)} </p>
          </div>
        </div>
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
