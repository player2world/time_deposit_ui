# GET STARTED

1. git clone https://github.com/player2world/time_deposit_ui.git
2. cd time_deposit_ui
3. yarn
4. yarn dev

## Setting up admin wallet

1. src/utils/constants.ts
2. Add public key to AUTHORITY_LIST in line 132

# TODO

## React

[ _ ] Multiple rerendering on page load

## User Deposit

[ X ] Deposit 2000, only deposit 1000
[ _ ] Menually update current vault balance
[ X ] Disable button and show message for insufficient fund in vault
[ X ] Reset claimable amount after withdraw

## Admin

[ _ ] Incorrect admin current balance
[ X ] Set condition to disable close vault on frontend
[ _ ] Support transfer admin

## Close vault

[ _ ] Display no vault page if no on-going vault available
