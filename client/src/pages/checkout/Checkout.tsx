import { useState } from "react";
import { useAppContext } from "../../providers/AppProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "w3-css/w3.css";
import { Button } from "@mantine/core";

const Checkout = () => {
  const { account, contract,token_contract } = useAppContext();
  const [Code, setCode] = useState<null | any>("");
  const [amount, setAmount] = useState<null | any>(0);
  const [appproveModalIsOpened, setAppproveModalIsOpened] = useState(false);
  const [codeModalIsOpened, setCodeModalIsOpened] = useState(false);


  console.log(contract.address)

  async function approveCode(Code: string) {
    if (account) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      const result = await contract.set_approve_code(Code);
      console.log(result);
      toast.success("transaction executed successfull!");
    }
  }


  const handleApprove = async() => {

    console.log("hello")

    if (account) {
      const result = await token_contract.approve(
        contract.address,
        amount
      );
      console.log(result);
      // toast.success("transaction executed successfull!");
    }
    setAppproveModalIsOpened(false);

  }

  return (
    <>
    <div className="item section__padding">
    <div className="create section__padding">
      <div className="create-container">
        <h1 className="approve Header">Set checkout approve code</h1>
        <div className="item-content-buy">
            <Button
              className="primary-btn"
              onClick={() => {
                setCodeModalIsOpened(true);
              }}
            >
              Set
            </Button>
          </div>
      </div>
    </div>
    <div className="create section__padding">
          <div className="create-container">
          <h1>Authorize Contract Spending</h1>
          <p className="authorize">Please confirm authorization for the Starkpay to spend on your behalf: </p>
          <div className="item-content-buy">
            <Button
              className="primary-btn"
              onClick={() => {
                setAppproveModalIsOpened(true);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
        {codeModalIsOpened && (
          <div className="w3-modal" style={{ display: "block" }}>
            <div className="w3-modal-content w3-padding">
              <div className="w3-container">
                <p>set code</p>
                <div className="formGroup">
                <label>code</label>
                <input
                  type="password"
                  value={Code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  placeholder=""
                  autoFocus={true}
                />
              </div>
                <button
                  className="w3-button w3-round w3-text-white w3-border w3-green"
                  type="button"
                  onClick={() => {
                    approveCode(Code);
                  }}
                >
                  set code
                </button>
                <button
                  className="w3-button w3-round w3-red w3-right"
                  onClick={() => {
                    setCodeModalIsOpened(false);
                  }}
                >
                  close
                </button>
              </div>
            </div>
          </div>
         
        )}
        {appproveModalIsOpened && (
          <div className="w3-modal" style={{ display: "block" }}>
            <div className="w3-modal-content w3-padding">
              <div className="w3-container">
                <p>Approve and set Amount</p>
                <div className="formGroup">
                  <label>Allowable Amount</label>
                  <input
                    type="number"
                    placeholder="Item e"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    value={amount}
                    autoFocus={true}
                  />
                </div>
                <button
                  onClick={handleApprove}
                  className="w3-button w3-round w3-text-white w3-border w3-green"
                >
                  Approve
                </button>
                <button
                  className="w3-button w3-round w3-red w3-right"
                  onClick={() => {
                    setAppproveModalIsOpened(false);
                  }}
                >
                  close
                </button>
              </div>
            </div>
          </div>
         
        )}
         </div>
      </div>
         </>
  );
};

export default Checkout;
function async() {
  throw new Error("Function not implemented.");
}

