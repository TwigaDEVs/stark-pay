import React, { useEffect, useState } from "react";
import "./gears.css";
import { AiFillHeart } from "react-icons/ai";
import gears1 from "../../assets/gear1.jpg";
import { Link } from "react-router-dom";
import { useAppContext } from "../../providers/AppProvider";
import { bigintToLongStrAddress, bigintToShortStr } from "../../config/utils";

interface GearsProps {
  title: string;
}

const Gears: React.FC<GearsProps> = ({ title }) => {
  const { account, contract } = useAppContext();
  const [services, setServices] = useState<null | any>([]);
  useEffect(() => {
    async function getService() {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      // console.log("this is the list");
      if (contract) {
        const result = await contract.get_all_services();
        setServices(result);
        console.log(result);
      }
      // contract ? console.log(contract) : "contract not yet loaded";
    }
    getService();
  }, [contract]);
  return (
    <div className="gears section__padding">
      <div className="gears-container">
        <div className="gears-container-text">
          <h1>{title}</h1>
        </div>
        <div className="gears-container-card">
          {services.map((service: any) => {
            let owner = bigintToLongStrAddress(service.owner);
            return (
              <div className="card-column">
                <div className="gears-card">
                  <div className="gears-card-top">
                    {/* <img src={gears1} alt="" /> */}
                    <Link
                      to={`/service/${bigintToShortStr(service.service_id)}`}
                    >
                      <p className="gears-title">
                        {bigintToShortStr(service.service_name)}
                      </p>
                      <br />
                      <p style={{ fontSize: "40px" }}>
                        {service.charge.toString()}
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

export default Gears;
