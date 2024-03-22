# GET STARTED

1. git clone https://github.com/player2world/time_deposit_ui.git
2. cd time_deposit_ui
3. yarn
4. yarn dev

## Setting up new vault

1. Add whitelist pubkey to AUTHORITY_LIST in line 134
2. Connect wallet to website and you'll see a create vault page
3. Fill in the form accordingly. On transcation completed, copy the vault pubkey and update it in src/utils/constants.ts - line 116
