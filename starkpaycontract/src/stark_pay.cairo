
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
    fn checkout(ref self:TContractState,service_hash:felt252);
    fn get_services_by_owner(self:@TContractState) -> Array<Service>;
    fn get_checkouts_by_owner(self: @TContractState) -> Arrray<ServiceCheckOut>;
    fn get_all_services(self: @TContractState) -> u256;
    fn get_all_checkouts(self: @TContractState) -> u256;
    fn get_user_balance(self: @TContractState) -> u256;
    fn get_token_name(self: @TContractState) -> felt252;
    fn get_token_symbol(self: @TContractState) -> felt252;
    fn set_approve_code(ref self:TContractState,code:felt252);

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
        checkouts: LegacyMap::<felt252, ServiceCheckOut>,
        approve_codes: LegacyMap::<ContractAddress, codehash>,
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

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct ServiceCheckOut {
        checkout_id : u128,
        user : ContractAddress,
        service_hash : felt252,
        amount: u256,
        timestamp:u256
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

            self.services.write(poseidon_hash,service)

            let ser_hash = self.services_hashes_count.read() + 1;

            self.services_hashes.write(ser_hash,poseidon_hash);

            self.services_hashes_count.write(ser_hash);

        }

        fn get_service(self:@ContractState, service_hash:felt252) -> Service{
            self.services.read(service_hash)
        }

        fn checkout(ref self:ContractState,service_hash:felt252){

            let user_address = get_caller_address();
            let user_balance = IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.balanceOf(user_address);
            let service = self.services.read(service_hash);
            assert(user_balance > service.charge, 'NOT ENOUGH BALANCE'); 

            let new_checkout_id = self.checkout_count.read() + 1

            let timestamp  = get_block_timestamp()

            IStarkPayTokenDispatcher { contract_address: self.erc720ContractAdrress.read() }.transfer(service.owner,service.charge);

            let checkout  = ServiceCheckOut {checkout_id : new_checkout_id, user : user_address,service_hash,amount: service.charge,timestamp }

            self.checkouts.write(service_hash, checkout);

            let poseidon_hash = PoseidonTrait::new().update_with(checkout).finalize();

            self.self.checkout_count.write(new_checkout_id);

            let check_hash = self.checkouts_hashes_count.read() + 1;

            self.checkout_hashes.write(check_hash,service_hash);

            self.checkouts_hashes_count.write(check_hash);

        }

        fn get_services_by_owner(self:@TContractState) -> Array<Service>{

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
        fn get_checkouts_by_owner(self: @TContractState) -> ServiceCheckOut;
        fn get_all_services(self: @TContractState) -> u256;
        fn get_all_checkouts(self: @TContractState) -> u256;
        fn get_user_balance(self: @TContractState) -> u256;
        fn get_token_name(self: @TContractState) -> felt252;
        fn get_token_symbol(self: @TContractState) -> felt252;
        fn set_approve_code(ref self:TContractState,code:felt252);


        fn add_service(ref self:ContractState, sub_package : felt252, channels : felt252, price : u128) {
            let key_ = self.packages_count.read() + 1;
             let new_package = Packages{sub_package:sub_package, channels:channels, price:price, package_id:key_};
            self.packages.write(key_, new_package);
            self.packages_count.write(key_);
        }

        fn get_package(self:@ContractState,key:u128) -> Packages{
            self.packages.read(key)
        }

        fn subs_package(ref self:ContractState, package_id : u128, user : ContractAddress, key:u128, message_key:u128) {
            let user_services = Subscription{package_id:package_id, user:user};
            let package = self.packages.read(package_id);
            if package.package_id == package_id {
                self.subscriptions.write(key, user_services);
                self.messages.write(message_key, Msg{recipient:user, msg:'Subscription successful'});
            }
        }

        fn get_message(self:@ContractState, key:u128) -> Msg {
            self.messages.read(key)
        }

        fn get_packages(self: @ContractState) -> Array<Packages> {
            let mut packages = ArrayTrait::<Packages>::new();
            let total_packages = self.packages_count.read();
            let mut count = 1;

            if total_packages > 0{
                loop {
                    let package = self.packages.read(count);
                    packages.append(package);
                    count +=1;
                    if(count > total_packages){
                        break;
                    }
                }
            }
            packages
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
    }
}

#[cfg(test)]
mod tests {


}

