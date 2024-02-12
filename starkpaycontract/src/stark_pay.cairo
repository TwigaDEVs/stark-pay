
use starkpaycontract::stark_pay::StarkPay::{Service,ServiceCheckOut,ContractAddress};
use core::array::ArrayTrait;

#[starknet::interface]
trait IStarkPayToken<TContractState> {

    fn name(self: @TContractState) -> felt252;
    fn owner(self: @TContractState) -> ContractAddress;
    fn symbol(self: @TContractState) -> felt252;
    fn totalSupply(self: @TContractState) -> u256;
    fn transfer(ref self: TContractState, to: ContractAddress, amount: u256);
    fn transferFrom(ref self: TContractState, sender: ContractAddress, to: ContractAddress, amount: u256);
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256);
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);

    }

#[starknet::interface]
trait starkPayTrait<TContractState> {

    fn add_service(ref self:TContractState, service_name : felt252, charge : u256, service_code : felt252, service_number: felt252);
    fn get_service(self:@TContractState, service_hash:felt252) -> Service;
    fn checkout(ref self:TContractState,service_hash:felt252,code:felt252);
    fn get_services_by_owner(self:@TContractState) -> Array<Service>;
    fn get_checkouts_by_owner(self: @TContractState) -> Array<ServiceCheckOut>;
    fn get_all_services(self: @TContractState) -> Array<Service>;
    fn get_all_checkouts(self: @TContractState) -> Array<ServiceCheckOut>;
    fn get_user_balance(self: @TContractState) -> u256;
    fn get_token_name(self: @TContractState) -> felt252;
    fn get_token_symbol(self: @TContractState) -> felt252;
    fn set_approve_code(ref self:TContractState,code:felt252);
    fn get_checkouts_for_service(self: @TContractState,service_hash_user:felt252) -> Array<ServiceCheckOut>;
    fn tokens_transfer(ref self: TContractState, to: ContractAddress, amount: u256);
    fn tokens_mint(ref self: TContractState, to: ContractAddress, amount: u256);

    }

#[starknet::contract]
mod StarkPay {

    use core::array::ArrayTrait;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use core::debug::PrintTrait;
    use super::{IStarkPayTokenDispatcher, IStarkPayTokenDispatcherTrait};
    use starknet::get_block_timestamp;
    use core::hash::{HashStateTrait, HashStateExTrait};
    use core::{poseidon::PoseidonTrait};


    #[storage]
    struct Storage {
        services : LegacyMap::<felt252, Service>,
        services_count: u128,
        checkout_count: u128,
        services_hashes_count: u128,
        checkouts_hashes_count: u128,
        checkouts: LegacyMap::<(felt252,felt252), ServiceCheckOut>,
        approve_codes: LegacyMap::<ContractAddress, felt252>,
        erc720ContractAdrress: ContractAddress,
        services_hashes:LegacyMap::<u128, felt252>,
        checkout_hashes: LegacyMap::<u128, (felt252,felt252)>,
    }

    #[constructor]
    fn constructor(ref self:ContractState,erc720_contract:ContractAddress) 
    {
        self.erc720ContractAdrress.write(erc720_contract);
        self.services_count.write(0);
        self.checkout_count.write(0);
        self.services_hashes_count.write(0);
        self.checkouts_hashes_count.write(0);
    }

    #[derive(Copy, Drop,Hash, Serde, starknet::Store)]
    struct Service {
        service_id: u128,
        service_name : felt252,
        owner : ContractAddress,
        charge : u256,
        service_code: felt252,
        service_number: felt252,
    }

    #[derive(Copy, Drop,Hash, Serde, starknet::Store)]
    struct ServiceCheckOut {
        checkout_id : u128,
        user : ContractAddress,
        service_hash : felt252,
        amount: u256,
        timestamp:u64
    }


    #[derive(Drop, Hash)]
    struct CodeDetails {
        user: ContractAddress,
        code: felt252,
    }


    #[external(v0)]
    impl starkPayImpl of super::starkPayTrait<ContractState> {



        fn add_service(ref self:ContractState, service_name : felt252, charge : u256, service_code : felt252, service_number: felt252){


            let user_address = get_caller_address();

            let service = Service { service_id: self.services_count.read() + 1 ,service_name, owner: user_address,charge,service_code,service_number };

            let new_id =  self.services_count.read() + 1;
            
            let poseidon_hash = PoseidonTrait::new().update_with(service).finalize();

            self.services_count.write(new_id);

            self.services.write(poseidon_hash,service);

            let ser_hash = self.services_hashes_count.read() + 1;

            self.services_hashes.write(ser_hash,poseidon_hash);

            self.services_hashes_count.write(ser_hash);

        }

        fn get_service(self:@ContractState, service_hash:felt252) -> Service{
            self.services.read(service_hash)
        }

        fn checkout(ref self:ContractState,service_hash:felt252,code:felt252){

            let user_address = get_caller_address();
            let user_balance = IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.balanceOf(user_address);
            let service = self.services.read(service_hash);

            assert(user_balance > service.charge, 'NOT ENOUGH BALANCE'); 

            let user = CodeDetails { user: user_address, code};

            let code_poseidon_hash = PoseidonTrait::new().update_with(user).finalize();

            assert(self.approve_codes.read(user_address) == code_poseidon_hash, 'AUTHENITIFICATION ERROR'); 

            let new_checkout_id = self.checkout_count.read() + 1;

            let timestamp  = get_block_timestamp();

            IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.transfer(service.owner,service.charge);

            let checkout  = ServiceCheckOut {checkout_id : new_checkout_id, user : user_address,service_hash,amount: service.charge,timestamp};

            let poseidon_hash = PoseidonTrait::new().update_with(checkout).finalize();

            self.checkouts.write((service_hash,poseidon_hash), checkout);

            

            self.checkout_count.write(new_checkout_id);

            let check_hash = self.checkouts_hashes_count.read() + 1;

            self.checkout_hashes.write(check_hash,(service_hash,poseidon_hash));

            self.checkouts_hashes_count.write(check_hash);

        }

        fn get_services_by_owner(self:@ContractState) -> Array<Service>{

            let user = get_caller_address();

            let mut services = ArrayTrait::<Service>::new();
            let total_services = self.services_hashes_count.read();

            let mut count = 1;

            if total_services > 0{
                loop {
                    let hash = self.services_hashes.read(count);
                    let service = self.services.read(hash);
                    if (service.owner == user){
                        services.append(service);
                    }
                    count +=1;
                    if(count > total_services){
                        break;
                    }
                }
            }

            services
        }
        fn get_checkouts_by_owner(self: @ContractState) -> Array<ServiceCheckOut>{
            
            let user = get_caller_address();

            let mut checkouts = ArrayTrait::<ServiceCheckOut>::new();
            let total_checkouts = self.checkouts_hashes_count.read();

            let mut count = 1;

            if total_checkouts > 0{
                loop {
                    let hash = self.checkout_hashes.read(count);
                    let checkout = self.checkouts.read(hash);
                    if (checkout.user == user){
                        checkouts.append(checkout);
                    }
                    count +=1;
                    if(count > total_checkouts){
                        break;
                    }
                }
            }

            checkouts
        }
        fn get_all_services(self: @ContractState) -> Array<Service>{
            
            let user = get_caller_address();

            let mut services = ArrayTrait::<Service>::new();
            let total_services = self.services_hashes_count.read();

            let mut count = 1;

            if total_services > 0{
                loop {
                    let hash = self.services_hashes.read(count);
                    let service = self.services.read(hash);
            
                    services.append(service);
                    
                    count +=1;
                    if(count > total_services){
                        break;
                    }
                }
            }

            services
        }
        fn get_all_checkouts(self: @ContractState) -> Array<ServiceCheckOut>{

            let user = get_caller_address();

            let mut checkouts = ArrayTrait::<ServiceCheckOut>::new();
            let total_checkouts = self.checkouts_hashes_count.read();

            let mut count = 1;

            if total_checkouts > 0{
                loop {
                    let hash = self.checkout_hashes.read(count);
                    let checkout = self.checkouts.read(hash);
                    
                    checkouts.append(checkout);
                    
                    count +=1;
                    if(count > total_checkouts){
                        break;
                    }
                }
            }

            checkouts

        }
 
        fn set_approve_code(ref self:ContractState,code:felt252){
            let user_address = get_caller_address();

            let user = CodeDetails { user: user_address, code};

            let poseidon_hash = PoseidonTrait::new().update_with(user).finalize();


            self.approve_codes.write(user_address, poseidon_hash);


        }


        fn get_token_name(self: @ContractState) -> felt252 {
            IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.name() 
        }

        fn get_token_symbol(self: @ContractState) -> felt252 {
            IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.symbol()
        }

        fn get_user_balance(self: @ContractState) -> u256{
            let user_address = get_caller_address();
            IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.balanceOf(user_address) 
        }

        fn get_checkouts_for_service(self: @ContractState,service_hash_user:felt252) -> Array<ServiceCheckOut>{

            let user = get_caller_address();

            let mut checkouts = ArrayTrait::<ServiceCheckOut>::new();
            let total_checkouts = self.checkouts_hashes_count.read();

            let mut count = 1;

            if total_checkouts > 0{
                loop {
                    let hash = self.checkout_hashes.read(count);

                    let (service_hash,checkout_hash) = hash;

                    if (service_hash_user == service_hash){

                        let checkout = self.checkouts.read(hash);
                        checkouts.append(checkout);

                    } 
                    
                    count +=1;
                    if(count > total_checkouts){
                        break;
                    }
                }
            }

            checkouts
        }

       fn tokens_transfer(ref self: ContractState, to: ContractAddress, amount: u256){

        IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.transfer(to,amount);

       }

       fn tokens_mint(ref self: ContractState, to: ContractAddress, amount: u256){

        IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.mint(to,amount);

       }
    }
}

#[cfg(test)]
mod tests {


}

