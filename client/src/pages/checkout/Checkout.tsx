import { useState } from "react";
import { useAppContext } from "../../providers/AppProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Checkout = () => {
  const { account, contract } = useAppContext();
  const [Code, setCode] = useState<null | any>("");

  async function approveCode(Code: string) {
    if (account) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      const result = await contract.set_approve_code(Code);
      console.log(result);
      toast.success("transaction executed successfull!");
    }
  }

  return (
    <div className="create section__padding">
      <div className="create-container">
        <h1>set checkout Approve code</h1>
        <form className="writeForm" autoComplete="off">
          {/* <div className="formGroup">
          <label>Upload</label>
          <input type="file" className="custom-file-input" />
        </div> */}

          <div className="formGroup">
            <label>code</label>
            <input
              type="password"
              value={Code}
              onChange={(e) => {
                setCode(e.target.value);
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
              approveCode(Code);
            }}
          >
            Approve
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
