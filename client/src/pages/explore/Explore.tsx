import React, { useEffect, useState } from "react";
import { Gears, ItemList } from "../../components";
import { useAppContext } from "../../providers/AppProvider";

const Explore: React.FC = () => {
  const { account, contract } = useAppContext();
  const [services, setServices] = useState<null | any>([]);
  useEffect(() => {
    async function getService() {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      // console.log("this is the list");
      if (contract) {
        const result = await contract.get_all_services();
        console.log(result);
      }
      // contract ? console.log(contract) : "contract not yet loaded";
    }
    getService();
  }, [contract]);

  return (
    <div>
      {/* <ItemList items={items} /> */}
      <Gears title="Top services" />
    </div>
  );
};

export default Explore;
