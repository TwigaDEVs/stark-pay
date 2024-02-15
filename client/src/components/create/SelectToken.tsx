import React from "react";
import { IToken, SelectTokenModal } from "starknet-tokenkit";

const SelectToken = () => {
  const [token, setToken] = React.useState<IToken>();
  return (
    <div>
      <SelectTokenModal
        selectedToken={token}
        callBackFunc={setToken}
        themeObject={{
          textColor: "white",
          modalBackground: "#4ca23f",
          headerFooterBackground: "rgba(0, 0, 0, 0.1)",
          tokenBackgroundColor: "rgba(0, 0, 0, 0.1)",
          tokenHoverColor: "rgba(0, 0, 0, 0.5)",
          searchBackgroundColor: "rgba(0, 0, 0, 0.5)",
          searchTextColor: "white",
          searchBorderColor: "#ccc",
        }}
      >
        <button type="button">{token ? token.name : "select token"}</button>
      </SelectTokenModal>
    </div>
  );
};

export default SelectToken;
