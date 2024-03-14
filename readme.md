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

[ _ ] Deposit 2000, only deposit 1000<br>
[ _ ] Manually update current vault balance<br>
[ _ ] Disable button and show a message for insufficient funds in vault<br>
[ _ ] Reset claimable amount after withdraw

## Admin

[ _ ] Incorrect admin current balance<br>
[ _ ] Set condition to disable close vault on frontend<br>
[ _ ] Support transfer admin<br>

## Close vault

[ _ ] Display no vault page if no ongoing vault is available
