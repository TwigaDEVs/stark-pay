import React, { useEffect, useState } from "react";
import "./services.css";
import { AiFillHeart } from "react-icons/ai";
import gears1 from "../../assets/gear1.jpg";
import { Link } from "react-router-dom";
import { useAppContext } from "../../providers/AppProvider";
import { bigintToLongStrAddress, bigintToShortStr } from "../../config/utils";

interface ServicesProps {
  title: string;
}

const Services: React.FC<ServicesProps> = ({ title }) => {
  const { account, contract } = useAppContext();
  const [checkouts, setCheckouts] = useState<null | any>([]);
  useEffect(() => {
    async function getCheckouts() {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      console.log("this is the list");
      if (contract) {
        const result = await contract.get_all_checkouts();
        setCheckouts(result);
        console.log(result);
      }
      // contract ? console.log(contract) : "contract not yet loaded";
    }
    getCheckouts();
  }, [contract,setCheckouts]);
  return (
    <div className="gears section__padding">
      <div className="gears-container">
      <div className="">

          </div>
        <div className="gears-container-text">
          <h1>{title}</h1>
        </div>
        <div className="gears-container-card">
          {checkouts.map((checkout: any) => {
            let owner = bigintToLongStrAddress(checkout.user);
            return (
              <div className="card-column">
                <div className="gears-card">
                  <div className="gears-card-top">
                    {/* <img src={gears1} alt="" /> */}
                    <Link
                      to={`/checkout/${bigintToShortStr(checkout.checkout_id)}`}
                    >
                      <br />
                      <p style={{ fontSize: "40px" }}>
                        {checkout.amount.toString()} STP
                      </p>
                    </Link>
                  </div>
                  <div className="gears-card-bottom">
                    <p>owner: {`${owner.substr(0, 6)}...${owner.slice(-6)}`}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="load-more">
        <button>Load More</button>
      </div>
    </div>
  );
};

export default Services;
