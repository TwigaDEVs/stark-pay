import "./create.css";
import { useState } from "react";
import Image from "../../assets/Image.png";
import { useAppContext } from "../../providers/AppProvider";
import SelectToken from "../../components/create/SelectToken";
import { TokenKitWrapper } from "starknet-tokenkit";
import { bigintToLongAddress } from "starknet-tokenkit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Create = () => {
  const { account, contract } = useAppContext();
  const [serviceName, setServiceName] = useState<null | any>("");
  const [charge, setCharge] = useState<null | any>(0);
  const [serviceCode, setServiceCode] = useState<null | any>("");
  const [serviceNumber, setServiceNumber] = useState<null | any>("");

  async function addService(
    serviceName: string,
    charge: number,
    serviceCode: string,
    serviceNumber: string
  ) {
    console.log(serviceName, charge, serviceCode, serviceNumber);

    if (account) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      const result = await contract.add_service(
        serviceName,
        Number(charge),
        serviceCode,
        serviceNumber
      );
      console.log(result);
      toast.success("transaction executed successfull!");
    }
  }

  return (
    <div className="create section__padding">
      <div className="create-container">
        <h1>Create new service</h1>
        <form className="writeForm" autoComplete="off">
          {/* <div className="formGroup">
            <label>Upload</label>
            <input type="file" className="custom-file-input" />
          </div> */}
          <div className="formGroup">
            <label>service Name</label>
            <input
              type="text"
              onChange={(e) => {
                setServiceName(e.target.value);
              }}
              value={serviceName}
              placeholder="Item Name"
              autoFocus={true}
            />
          </div>
          <div className="formGroup">
            <label>charge</label>
            <input
              type="number"
              placeholder="Item Name"
              onChange={(e) => {
                setCharge(e.target.value);
              }}
              value={charge}
              autoFocus={true}
            />
          </div>
          <div className="formGroup">
            <label>service code</label>
            <input
              type="text"
              value={serviceCode}
              onChange={(e) => {
                setServiceCode(e.target.value);
              }}
              placeholder="Item Name"
              autoFocus={true}
            />
          </div>
          <div className="formGroup">
            <label>service Number</label>
            <input
              value={serviceNumber}
              type="text"
              onChange={(e) => {
                setServiceNumber(e.target.value);
              }}
              placeholder="Item Name"
              autoFocus={true}
            />
          </div>
          <ToastContainer />

          <button
            className="writeButton"
            type="button"
            onClick={() => {
              addService(serviceName, charge, serviceCode, serviceNumber);
            }}
          >
            Create Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
