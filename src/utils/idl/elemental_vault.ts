export type ElementalVault = {
  "version": "0.1.0",
  "name": "elemental_vault",
  "instructions": [
    {
      "name": "initGlobal",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "global",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initOrUpdateVault",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "global",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "InitOrUpdateVaultParam"
          }
        }
      ]
    },
    {
      "name": "updateAuthority",
      "accounts": [
        {
          "name": "currentAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initOrDepositUser",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "amountToTransfer",
          "type": "u64"
        }
      ]
    },
    {
      "name": "authorityWithdraw",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "userWithdraw",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeVault",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "global",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCount",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "baseMint",
            "type": "publicKey"
          },
          {
            "name": "yieldBps",
            "type": "u16"
          },
          {
            "name": "vaultCapacity",
            "type": "u64"
          },
          {
            "name": "minAmount",
            "type": "u64"
          },
          {
            "name": "startDate",
            "type": "u64"
          },
          {
            "name": "endDate",
            "type": "u64"
          },
          {
            "name": "withdrawTimeframe",
            "type": "u64"
          },
          {
            "name": "amountCollected",
            "type": "u64"
          },
          {
            "name": "amountWithdrawn",
            "type": "u64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCount",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitOrUpdateVaultParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "yieldBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "vaultCapacity",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "minAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "startDate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "endDate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "withdrawTimeframe",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Signer does not have authorisation"
    },
    {
      "code": 6001,
      "name": "InvalidMultiple",
      "msg": "Invalid multiple"
    },
    {
      "code": 6002,
      "name": "IncorrectCount",
      "msg": "Pass in the current counter's count"
    },
    {
      "code": 6003,
      "name": "NotUpdatable",
      "msg": "Escrow state no longer updatable"
    },
    {
      "code": 6004,
      "name": "InvalidTimeInput",
      "msg": "Invalid time input"
    },
    {
      "code": 6005,
      "name": "InvalidStartTimeInput",
      "msg": "Start date must be later than the current time"
    },
    {
      "code": 6006,
      "name": "InvalidEndTimeInput",
      "msg": "End date must be later than start time"
    },
    {
      "code": 6007,
      "name": "MissingParams",
      "msg": "All params must to included to initialize escrow"
    },
    {
      "code": 6008,
      "name": "AmountExceedVaultCapacity",
      "msg": "Amount exceed vault capacity"
    },
    {
      "code": 6009,
      "name": "VaultClose",
      "msg": "Vault no longer accepting new deposit"
    },
    {
      "code": 6010,
      "name": "VaultNotReady",
      "msg": "Vault not ready"
    },
    {
      "code": 6011,
      "name": "InvalidMint",
      "msg": "Incorrect mint input"
    },
    {
      "code": 6012,
      "name": "Overflow",
      "msg": "Overflow detected"
    }
  ]
};

export const IDL: ElementalVault = {
  "version": "0.1.0",
  "name": "elemental_vault",
  "instructions": [
    {
      "name": "initGlobal",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "global",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initOrUpdateVault",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "global",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "InitOrUpdateVaultParam"
          }
        }
      ]
    },
    {
      "name": "updateAuthority",
      "accounts": [
        {
          "name": "currentAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initOrDepositUser",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "amountToTransfer",
          "type": "u64"
        }
      ]
    },
    {
      "name": "authorityWithdraw",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "userWithdraw",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeVault",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultCount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "global",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCount",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "baseMint",
            "type": "publicKey"
          },
          {
            "name": "yieldBps",
            "type": "u16"
          },
          {
            "name": "vaultCapacity",
            "type": "u64"
          },
          {
            "name": "minAmount",
            "type": "u64"
          },
          {
            "name": "startDate",
            "type": "u64"
          },
          {
            "name": "endDate",
            "type": "u64"
          },
          {
            "name": "withdrawTimeframe",
            "type": "u64"
          },
          {
            "name": "amountCollected",
            "type": "u64"
          },
          {
            "name": "amountWithdrawn",
            "type": "u64"
          },
          {
            "name": "amountRedeemed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultCount",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitOrUpdateVaultParam",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "yieldBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "vaultCapacity",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "minAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "startDate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "endDate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "withdrawTimeframe",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Signer does not have authorisation"
    },
    {
      "code": 6001,
      "name": "InvalidMultiple",
      "msg": "Invalid multiple"
    },
    {
      "code": 6002,
      "name": "IncorrectCount",
      "msg": "Pass in the current counter's count"
    },
    {
      "code": 6003,
      "name": "NotUpdatable",
      "msg": "Escrow state no longer updatable"
    },
    {
      "code": 6004,
      "name": "InvalidTimeInput",
      "msg": "Invalid time input"
    },
    {
      "code": 6005,
      "name": "InvalidStartTimeInput",
      "msg": "Start date must be later than the current time"
    },
    {
      "code": 6006,
      "name": "InvalidEndTimeInput",
      "msg": "End date must be later than start time"
    },
    {
      "code": 6007,
      "name": "MissingParams",
      "msg": "All params must to included to initialize escrow"
    },
    {
      "code": 6008,
      "name": "AmountExceedVaultCapacity",
      "msg": "Amount exceed vault capacity"
    },
    {
      "code": 6009,
      "name": "VaultClose",
      "msg": "Vault no longer accepting new deposit"
    },
    {
      "code": 6010,
      "name": "VaultNotReady",
      "msg": "Vault not ready"
    },
    {
      "code": 6011,
      "name": "InvalidMint",
      "msg": "Incorrect mint input"
    },
    {
      "code": 6012,
      "name": "Overflow",
      "msg": "Overflow detected"
    }
  ]
};
