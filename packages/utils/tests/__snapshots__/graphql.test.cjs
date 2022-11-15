/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/unit/graphql.test.ts TAP > must match snapshot 1`] = `
{
  "Tweet": {
    "name": "Tweet",
    "type": "Tweet",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1082,
              "end": 1084
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1086,
                  "end": 1088
                }
              },
              "loc": {
                "start": 1086,
                "end": 1088
              }
            },
            "loc": {
              "start": 1086,
              "end": 1089
            }
          },
          "directives": [],
          "loc": {
            "start": 1082,
            "end": 1089
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "Tweet",
        "loc": {
          "start": 1076,
          "end": 1081
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1082,
              "end": 1084
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1086,
                  "end": 1088
                }
              },
              "loc": {
                "start": 1086,
                "end": 1088
              }
            },
            "loc": {
              "start": 1086,
              "end": 1089
            }
          },
          "directives": [],
          "loc": {
            "start": 1082,
            "end": 1089
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1092,
            "end": 1097
          }
        },
        "loc": {
          "start": 1092,
          "end": 1097
        }
      },
      "directives": [],
      "loc": {
        "start": 1076,
        "end": 1097
      }
    }
  },
  "Tweets": {
    "name": "Tweets",
    "type": "[Tweet]!",
    "args": [
      {
        "name": "limit",
        "type": "Int",
        "defaultValue": 5,
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "limit",
            "loc": {
              "start": 1109,
              "end": 1114
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1116,
                "end": 1119
              }
            },
            "loc": {
              "start": 1116,
              "end": 1119
            }
          },
          "defaultValue": {
            "kind": "IntValue",
            "value": "5",
            "loc": {
              "start": 1122,
              "end": 1123
            }
          },
          "directives": [],
          "loc": {
            "start": 1109,
            "end": 1123
          }
        }
      },
      {
        "name": "skip",
        "type": "Int",
        "defaultValue": 0,
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "skip",
            "loc": {
              "start": 1125,
              "end": 1129
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1131,
                "end": 1134
              }
            },
            "loc": {
              "start": 1131,
              "end": 1134
            }
          },
          "defaultValue": {
            "kind": "IntValue",
            "value": "0",
            "loc": {
              "start": 1137,
              "end": 1138
            }
          },
          "directives": [],
          "loc": {
            "start": 1125,
            "end": 1138
          }
        }
      },
      {
        "name": "sort_field",
        "type": "String",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "sort_field",
            "loc": {
              "start": 1140,
              "end": 1150
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String",
              "loc": {
                "start": 1152,
                "end": 1158
              }
            },
            "loc": {
              "start": 1152,
              "end": 1158
            }
          },
          "directives": [],
          "loc": {
            "start": 1140,
            "end": 1158
          }
        }
      },
      {
        "name": "sort_order",
        "type": "String",
        "defaultValue": "ASC",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "sort_order",
            "loc": {
              "start": 1160,
              "end": 1170
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String",
              "loc": {
                "start": 1172,
                "end": 1178
              }
            },
            "loc": {
              "start": 1172,
              "end": 1178
            }
          },
          "defaultValue": {
            "kind": "StringValue",
            "value": "ASC",
            "block": false,
            "loc": {
              "start": 1181,
              "end": 1186
            }
          },
          "directives": [],
          "loc": {
            "start": 1160,
            "end": 1186
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "Tweets",
        "loc": {
          "start": 1102,
          "end": 1108
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "limit",
            "loc": {
              "start": 1109,
              "end": 1114
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1116,
                "end": 1119
              }
            },
            "loc": {
              "start": 1116,
              "end": 1119
            }
          },
          "defaultValue": {
            "kind": "IntValue",
            "value": "5",
            "loc": {
              "start": 1122,
              "end": 1123
            }
          },
          "directives": [],
          "loc": {
            "start": 1109,
            "end": 1123
          }
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "skip",
            "loc": {
              "start": 1125,
              "end": 1129
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1131,
                "end": 1134
              }
            },
            "loc": {
              "start": 1131,
              "end": 1134
            }
          },
          "defaultValue": {
            "kind": "IntValue",
            "value": "0",
            "loc": {
              "start": 1137,
              "end": 1138
            }
          },
          "directives": [],
          "loc": {
            "start": 1125,
            "end": 1138
          }
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "sort_field",
            "loc": {
              "start": 1140,
              "end": 1150
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String",
              "loc": {
                "start": 1152,
                "end": 1158
              }
            },
            "loc": {
              "start": 1152,
              "end": 1158
            }
          },
          "directives": [],
          "loc": {
            "start": 1140,
            "end": 1158
          }
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "sort_order",
            "loc": {
              "start": 1160,
              "end": 1170
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String",
              "loc": {
                "start": 1172,
                "end": 1178
              }
            },
            "loc": {
              "start": 1172,
              "end": 1178
            }
          },
          "defaultValue": {
            "kind": "StringValue",
            "value": "ASC",
            "block": false,
            "loc": {
              "start": 1181,
              "end": 1186
            }
          },
          "directives": [],
          "loc": {
            "start": 1160,
            "end": 1186
          }
        }
      ],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Tweet",
              "loc": {
                "start": 1190,
                "end": 1195
              }
            },
            "loc": {
              "start": 1190,
              "end": 1195
            }
          },
          "loc": {
            "start": 1189,
            "end": 1196
          }
        },
        "loc": {
          "start": 1189,
          "end": 1197
        }
      },
      "directives": [],
      "loc": {
        "start": 1102,
        "end": 1197
      }
    }
  },
  "TweetsMeta": {
    "name": "TweetsMeta",
    "type": "Meta",
    "args": [],
    "deprecationReason": "No longer supported",
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "TweetsMeta",
        "loc": {
          "start": 1202,
          "end": 1212
        }
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Meta",
          "loc": {
            "start": 1214,
            "end": 1218
          }
        },
        "loc": {
          "start": 1214,
          "end": 1218
        }
      },
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "deprecated",
            "loc": {
              "start": 1220,
              "end": 1230
            }
          },
          "arguments": [],
          "loc": {
            "start": 1219,
            "end": 1230
          }
        }
      ],
      "loc": {
        "start": 1202,
        "end": 1230
      }
    }
  },
  "User": {
    "name": "User",
    "type": "User",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1240,
              "end": 1242
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1244,
                  "end": 1246
                }
              },
              "loc": {
                "start": 1244,
                "end": 1246
              }
            },
            "loc": {
              "start": 1244,
              "end": 1247
            }
          },
          "directives": [],
          "loc": {
            "start": 1240,
            "end": 1247
          }
        }
      }
    ],
    "deprecationReason": "Use \`Users\`.",
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "User",
        "loc": {
          "start": 1235,
          "end": 1239
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1240,
              "end": 1242
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1244,
                  "end": 1246
                }
              },
              "loc": {
                "start": 1244,
                "end": 1246
              }
            },
            "loc": {
              "start": 1244,
              "end": 1247
            }
          },
          "directives": [],
          "loc": {
            "start": 1240,
            "end": 1247
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "User",
          "loc": {
            "start": 1250,
            "end": 1254
          }
        },
        "loc": {
          "start": 1250,
          "end": 1254
        }
      },
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "deprecated",
            "loc": {
              "start": 1256,
              "end": 1266
            }
          },
          "arguments": [
            {
              "kind": "Argument",
              "name": {
                "kind": "Name",
                "value": "reason",
                "loc": {
                  "start": 1267,
                  "end": 1273
                }
              },
              "value": {
                "kind": "StringValue",
                "value": "Use \`Users\`.",
                "block": false,
                "loc": {
                  "start": 1275,
                  "end": 1289
                }
              },
              "loc": {
                "start": 1267,
                "end": 1289
              }
            }
          ],
          "loc": {
            "start": 1255,
            "end": 1290
          }
        }
      ],
      "loc": {
        "start": 1235,
        "end": 1290
      }
    }
  },
  "Users": {
    "name": "Users",
    "type": "[User]!",
    "args": [
      {
        "name": "id",
        "type": "[ID!]!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1301,
              "end": 1303
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID",
                    "loc": {
                      "start": 1306,
                      "end": 1308
                    }
                  },
                  "loc": {
                    "start": 1306,
                    "end": 1308
                  }
                },
                "loc": {
                  "start": 1306,
                  "end": 1309
                }
              },
              "loc": {
                "start": 1305,
                "end": 1310
              }
            },
            "loc": {
              "start": 1305,
              "end": 1311
            }
          },
          "directives": [],
          "loc": {
            "start": 1301,
            "end": 1311
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "Users",
        "loc": {
          "start": 1295,
          "end": 1300
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1301,
              "end": 1303
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID",
                    "loc": {
                      "start": 1306,
                      "end": 1308
                    }
                  },
                  "loc": {
                    "start": 1306,
                    "end": 1308
                  }
                },
                "loc": {
                  "start": 1306,
                  "end": 1309
                }
              },
              "loc": {
                "start": 1305,
                "end": 1310
              }
            },
            "loc": {
              "start": 1305,
              "end": 1311
            }
          },
          "directives": [],
          "loc": {
            "start": 1301,
            "end": 1311
          }
        }
      ],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User",
              "loc": {
                "start": 1315,
                "end": 1319
              }
            },
            "loc": {
              "start": 1315,
              "end": 1319
            }
          },
          "loc": {
            "start": 1314,
            "end": 1320
          }
        },
        "loc": {
          "start": 1314,
          "end": 1321
        }
      },
      "directives": [],
      "loc": {
        "start": 1295,
        "end": 1321
      }
    }
  },
  "NotificationsMeta": {
    "name": "NotificationsMeta",
    "type": "Meta",
    "args": [],
    "deprecationReason": "No longer supported",
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "NotificationsMeta",
        "loc": {
          "start": 1326,
          "end": 1343
        }
      },
      "arguments": [],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Meta",
          "loc": {
            "start": 1345,
            "end": 1349
          }
        },
        "loc": {
          "start": 1345,
          "end": 1349
        }
      },
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "deprecated",
            "loc": {
              "start": 1351,
              "end": 1361
            }
          },
          "arguments": [],
          "loc": {
            "start": 1350,
            "end": 1361
          }
        }
      ],
      "loc": {
        "start": 1326,
        "end": 1361
      }
    }
  }
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 10`] = `
{
  "SRI": "SRI",
  "ID": "ID",
  "String": "String",
  "Int": "Int",
  "Url": "Url",
  "Date": "Date",
  "Boolean": "Boolean"
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 11`] = `
{
  "queries": {
    "Tweet": {
      "name": "Tweet",
      "type": "Tweet",
      "args": [
        {
          "name": "id",
          "type": "ID!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1082,
                "end": 1084
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1086,
                    "end": 1088
                  }
                },
                "loc": {
                  "start": 1086,
                  "end": 1088
                }
              },
              "loc": {
                "start": 1086,
                "end": 1089
              }
            },
            "directives": [],
            "loc": {
              "start": 1082,
              "end": 1089
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1076,
            "end": 1081
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1082,
                "end": 1084
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1086,
                    "end": 1088
                  }
                },
                "loc": {
                  "start": 1086,
                  "end": 1088
                }
              },
              "loc": {
                "start": 1086,
                "end": 1089
              }
            },
            "directives": [],
            "loc": {
              "start": 1082,
              "end": 1089
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tweet",
            "loc": {
              "start": 1092,
              "end": 1097
            }
          },
          "loc": {
            "start": 1092,
            "end": 1097
          }
        },
        "directives": [],
        "loc": {
          "start": 1076,
          "end": 1097
        }
      }
    },
    "Tweets": {
      "name": "Tweets",
      "type": "[Tweet]!",
      "args": [
        {
          "name": "limit",
          "type": "Int",
          "defaultValue": 5,
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "limit",
              "loc": {
                "start": 1109,
                "end": 1114
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1116,
                  "end": 1119
                }
              },
              "loc": {
                "start": 1116,
                "end": 1119
              }
            },
            "defaultValue": {
              "kind": "IntValue",
              "value": "5",
              "loc": {
                "start": 1122,
                "end": 1123
              }
            },
            "directives": [],
            "loc": {
              "start": 1109,
              "end": 1123
            }
          }
        },
        {
          "name": "skip",
          "type": "Int",
          "defaultValue": 0,
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "skip",
              "loc": {
                "start": 1125,
                "end": 1129
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1131,
                  "end": 1134
                }
              },
              "loc": {
                "start": 1131,
                "end": 1134
              }
            },
            "defaultValue": {
              "kind": "IntValue",
              "value": "0",
              "loc": {
                "start": 1137,
                "end": 1138
              }
            },
            "directives": [],
            "loc": {
              "start": 1125,
              "end": 1138
            }
          }
        },
        {
          "name": "sort_field",
          "type": "String",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "sort_field",
              "loc": {
                "start": 1140,
                "end": 1150
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 1152,
                  "end": 1158
                }
              },
              "loc": {
                "start": 1152,
                "end": 1158
              }
            },
            "directives": [],
            "loc": {
              "start": 1140,
              "end": 1158
            }
          }
        },
        {
          "name": "sort_order",
          "type": "String",
          "defaultValue": "ASC",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "sort_order",
              "loc": {
                "start": 1160,
                "end": 1170
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 1172,
                  "end": 1178
                }
              },
              "loc": {
                "start": 1172,
                "end": 1178
              }
            },
            "defaultValue": {
              "kind": "StringValue",
              "value": "ASC",
              "block": false,
              "loc": {
                "start": 1181,
                "end": 1186
              }
            },
            "directives": [],
            "loc": {
              "start": 1160,
              "end": 1186
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "Tweets",
          "loc": {
            "start": 1102,
            "end": 1108
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "limit",
              "loc": {
                "start": 1109,
                "end": 1114
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1116,
                  "end": 1119
                }
              },
              "loc": {
                "start": 1116,
                "end": 1119
              }
            },
            "defaultValue": {
              "kind": "IntValue",
              "value": "5",
              "loc": {
                "start": 1122,
                "end": 1123
              }
            },
            "directives": [],
            "loc": {
              "start": 1109,
              "end": 1123
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "skip",
              "loc": {
                "start": 1125,
                "end": 1129
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1131,
                  "end": 1134
                }
              },
              "loc": {
                "start": 1131,
                "end": 1134
              }
            },
            "defaultValue": {
              "kind": "IntValue",
              "value": "0",
              "loc": {
                "start": 1137,
                "end": 1138
              }
            },
            "directives": [],
            "loc": {
              "start": 1125,
              "end": 1138
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "sort_field",
              "loc": {
                "start": 1140,
                "end": 1150
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 1152,
                  "end": 1158
                }
              },
              "loc": {
                "start": 1152,
                "end": 1158
              }
            },
            "directives": [],
            "loc": {
              "start": 1140,
              "end": 1158
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "sort_order",
              "loc": {
                "start": 1160,
                "end": 1170
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 1172,
                  "end": 1178
                }
              },
              "loc": {
                "start": 1172,
                "end": 1178
              }
            },
            "defaultValue": {
              "kind": "StringValue",
              "value": "ASC",
              "block": false,
              "loc": {
                "start": 1181,
                "end": 1186
              }
            },
            "directives": [],
            "loc": {
              "start": 1160,
              "end": 1186
            }
          }
        ],
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "ListType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Tweet",
                "loc": {
                  "start": 1190,
                  "end": 1195
                }
              },
              "loc": {
                "start": 1190,
                "end": 1195
              }
            },
            "loc": {
              "start": 1189,
              "end": 1196
            }
          },
          "loc": {
            "start": 1189,
            "end": 1197
          }
        },
        "directives": [],
        "loc": {
          "start": 1102,
          "end": 1197
        }
      }
    },
    "TweetsMeta": {
      "name": "TweetsMeta",
      "type": "Meta",
      "args": [],
      "deprecationReason": "No longer supported",
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "TweetsMeta",
          "loc": {
            "start": 1202,
            "end": 1212
          }
        },
        "arguments": [],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Meta",
            "loc": {
              "start": 1214,
              "end": 1218
            }
          },
          "loc": {
            "start": 1214,
            "end": 1218
          }
        },
        "directives": [
          {
            "kind": "Directive",
            "name": {
              "kind": "Name",
              "value": "deprecated",
              "loc": {
                "start": 1220,
                "end": 1230
              }
            },
            "arguments": [],
            "loc": {
              "start": 1219,
              "end": 1230
            }
          }
        ],
        "loc": {
          "start": 1202,
          "end": 1230
        }
      }
    },
    "User": {
      "name": "User",
      "type": "User",
      "args": [
        {
          "name": "id",
          "type": "ID!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1240,
                "end": 1242
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1244,
                    "end": 1246
                  }
                },
                "loc": {
                  "start": 1244,
                  "end": 1246
                }
              },
              "loc": {
                "start": 1244,
                "end": 1247
              }
            },
            "directives": [],
            "loc": {
              "start": 1240,
              "end": 1247
            }
          }
        }
      ],
      "deprecationReason": "Use \`Users\`.",
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "User",
          "loc": {
            "start": 1235,
            "end": 1239
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1240,
                "end": 1242
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1244,
                    "end": 1246
                  }
                },
                "loc": {
                  "start": 1244,
                  "end": 1246
                }
              },
              "loc": {
                "start": 1244,
                "end": 1247
              }
            },
            "directives": [],
            "loc": {
              "start": 1240,
              "end": 1247
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "User",
            "loc": {
              "start": 1250,
              "end": 1254
            }
          },
          "loc": {
            "start": 1250,
            "end": 1254
          }
        },
        "directives": [
          {
            "kind": "Directive",
            "name": {
              "kind": "Name",
              "value": "deprecated",
              "loc": {
                "start": 1256,
                "end": 1266
              }
            },
            "arguments": [
              {
                "kind": "Argument",
                "name": {
                  "kind": "Name",
                  "value": "reason",
                  "loc": {
                    "start": 1267,
                    "end": 1273
                  }
                },
                "value": {
                  "kind": "StringValue",
                  "value": "Use \`Users\`.",
                  "block": false,
                  "loc": {
                    "start": 1275,
                    "end": 1289
                  }
                },
                "loc": {
                  "start": 1267,
                  "end": 1289
                }
              }
            ],
            "loc": {
              "start": 1255,
              "end": 1290
            }
          }
        ],
        "loc": {
          "start": 1235,
          "end": 1290
        }
      }
    },
    "Users": {
      "name": "Users",
      "type": "[User]!",
      "args": [
        {
          "name": "id",
          "type": "[ID!]!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1301,
                "end": 1303
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "ID",
                      "loc": {
                        "start": 1306,
                        "end": 1308
                      }
                    },
                    "loc": {
                      "start": 1306,
                      "end": 1308
                    }
                  },
                  "loc": {
                    "start": 1306,
                    "end": 1309
                  }
                },
                "loc": {
                  "start": 1305,
                  "end": 1310
                }
              },
              "loc": {
                "start": 1305,
                "end": 1311
              }
            },
            "directives": [],
            "loc": {
              "start": 1301,
              "end": 1311
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "Users",
          "loc": {
            "start": 1295,
            "end": 1300
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1301,
                "end": 1303
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "ID",
                      "loc": {
                        "start": 1306,
                        "end": 1308
                      }
                    },
                    "loc": {
                      "start": 1306,
                      "end": 1308
                    }
                  },
                  "loc": {
                    "start": 1306,
                    "end": 1309
                  }
                },
                "loc": {
                  "start": 1305,
                  "end": 1310
                }
              },
              "loc": {
                "start": 1305,
                "end": 1311
              }
            },
            "directives": [],
            "loc": {
              "start": 1301,
              "end": 1311
            }
          }
        ],
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "ListType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "User",
                "loc": {
                  "start": 1315,
                  "end": 1319
                }
              },
              "loc": {
                "start": 1315,
                "end": 1319
              }
            },
            "loc": {
              "start": 1314,
              "end": 1320
            }
          },
          "loc": {
            "start": 1314,
            "end": 1321
          }
        },
        "directives": [],
        "loc": {
          "start": 1295,
          "end": 1321
        }
      }
    },
    "NotificationsMeta": {
      "name": "NotificationsMeta",
      "type": "Meta",
      "args": [],
      "deprecationReason": "No longer supported",
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "NotificationsMeta",
          "loc": {
            "start": 1326,
            "end": 1343
          }
        },
        "arguments": [],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Meta",
            "loc": {
              "start": 1345,
              "end": 1349
            }
          },
          "loc": {
            "start": 1345,
            "end": 1349
          }
        },
        "directives": [
          {
            "kind": "Directive",
            "name": {
              "kind": "Name",
              "value": "deprecated",
              "loc": {
                "start": 1351,
                "end": 1361
              }
            },
            "arguments": [],
            "loc": {
              "start": 1350,
              "end": 1361
            }
          }
        ],
        "loc": {
          "start": 1326,
          "end": 1361
        }
      }
    }
  },
  "mutations": {
    "createTweet": {
      "name": "createTweet",
      "type": "Tweet",
      "args": [
        {
          "name": "input",
          "type": "TweetContent",
          "deprecationReason": "Use \`content\`.",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "input",
              "loc": {
                "start": 1407,
                "end": 1412
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "TweetContent",
                "loc": {
                  "start": 1414,
                  "end": 1426
                }
              },
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "directives": [
              {
                "kind": "Directive",
                "name": {
                  "kind": "Name",
                  "value": "deprecated",
                  "loc": {
                    "start": 1428,
                    "end": 1438
                  }
                },
                "arguments": [
                  {
                    "kind": "Argument",
                    "name": {
                      "kind": "Name",
                      "value": "reason",
                      "loc": {
                        "start": 1439,
                        "end": 1445
                      }
                    },
                    "value": {
                      "kind": "StringValue",
                      "value": "Use \`content\`.",
                      "block": false,
                      "loc": {
                        "start": 1447,
                        "end": 1463
                      }
                    },
                    "loc": {
                      "start": 1439,
                      "end": 1463
                    }
                  }
                ],
                "loc": {
                  "start": 1427,
                  "end": 1464
                }
              }
            ],
            "loc": {
              "start": 1407,
              "end": 1464
            }
          }
        },
        {
          "name": "content",
          "type": "TweetContent",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "content",
              "loc": {
                "start": 1473,
                "end": 1480
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "TweetContent",
                "loc": {
                  "start": 1482,
                  "end": 1494
                }
              },
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "directives": [],
            "loc": {
              "start": 1473,
              "end": 1494
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "createTweet",
          "loc": {
            "start": 1385,
            "end": 1396
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "input",
              "loc": {
                "start": 1407,
                "end": 1412
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "TweetContent",
                "loc": {
                  "start": 1414,
                  "end": 1426
                }
              },
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "directives": [
              {
                "kind": "Directive",
                "name": {
                  "kind": "Name",
                  "value": "deprecated",
                  "loc": {
                    "start": 1428,
                    "end": 1438
                  }
                },
                "arguments": [
                  {
                    "kind": "Argument",
                    "name": {
                      "kind": "Name",
                      "value": "reason",
                      "loc": {
                        "start": 1439,
                        "end": 1445
                      }
                    },
                    "value": {
                      "kind": "StringValue",
                      "value": "Use \`content\`.",
                      "block": false,
                      "loc": {
                        "start": 1447,
                        "end": 1463
                      }
                    },
                    "loc": {
                      "start": 1439,
                      "end": 1463
                    }
                  }
                ],
                "loc": {
                  "start": 1427,
                  "end": 1464
                }
              }
            ],
            "loc": {
              "start": 1407,
              "end": 1464
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "content",
              "loc": {
                "start": 1473,
                "end": 1480
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "TweetContent",
                "loc": {
                  "start": 1482,
                  "end": 1494
                }
              },
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "directives": [],
            "loc": {
              "start": 1473,
              "end": 1494
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tweet",
            "loc": {
              "start": 1502,
              "end": 1507
            }
          },
          "loc": {
            "start": 1502,
            "end": 1507
          }
        },
        "directives": [],
        "loc": {
          "start": 1385,
          "end": 1507
        }
      }
    },
    "deleteTweet": {
      "name": "deleteTweet",
      "type": "Tweet",
      "args": [
        {
          "name": "id",
          "type": "ID!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1524,
                "end": 1526
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1528,
                    "end": 1530
                  }
                },
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1531
              }
            },
            "directives": [],
            "loc": {
              "start": 1524,
              "end": 1531
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "deleteTweet",
          "loc": {
            "start": 1512,
            "end": 1523
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1524,
                "end": 1526
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1528,
                    "end": 1530
                  }
                },
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1531
              }
            },
            "directives": [],
            "loc": {
              "start": 1524,
              "end": 1531
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Tweet",
            "loc": {
              "start": 1534,
              "end": 1539
            }
          },
          "loc": {
            "start": 1534,
            "end": 1539
          }
        },
        "directives": [
          {
            "kind": "Directive",
            "name": {
              "kind": "Name",
              "value": "noDoc",
              "loc": {
                "start": 1541,
                "end": 1546
              }
            },
            "arguments": [],
            "loc": {
              "start": 1540,
              "end": 1546
            }
          }
        ],
        "loc": {
          "start": 1512,
          "end": 1546
        }
      }
    },
    "markTweetRead": {
      "name": "markTweetRead",
      "type": "Boolean",
      "args": [
        {
          "name": "id",
          "type": "ID!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1565,
                "end": 1567
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1569,
                    "end": 1571
                  }
                },
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1572
              }
            },
            "directives": [],
            "loc": {
              "start": 1565,
              "end": 1572
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "markTweetRead",
          "loc": {
            "start": 1551,
            "end": 1564
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 1565,
                "end": 1567
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "ID",
                  "loc": {
                    "start": 1569,
                    "end": 1571
                  }
                },
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1572
              }
            },
            "directives": [],
            "loc": {
              "start": 1565,
              "end": 1572
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Boolean",
            "loc": {
              "start": 1575,
              "end": 1582
            }
          },
          "loc": {
            "start": 1575,
            "end": 1582
          }
        },
        "directives": [],
        "loc": {
          "start": 1551,
          "end": 1582
        }
      }
    }
  },
  "subscriptions": {
    "Notifications": {
      "name": "Notifications",
      "type": "[Notification]!",
      "args": [
        {
          "name": "limit",
          "type": "Int",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "limit",
              "loc": {
                "start": 1716,
                "end": 1721
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1723,
                  "end": 1726
                }
              },
              "loc": {
                "start": 1723,
                "end": 1726
              }
            },
            "directives": [],
            "loc": {
              "start": 1716,
              "end": 1726
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "Notifications",
          "loc": {
            "start": 1702,
            "end": 1715
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "limit",
              "loc": {
                "start": 1716,
                "end": 1721
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 1723,
                  "end": 1726
                }
              },
              "loc": {
                "start": 1723,
                "end": 1726
              }
            },
            "directives": [],
            "loc": {
              "start": 1716,
              "end": 1726
            }
          }
        ],
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "ListType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Notification",
                "loc": {
                  "start": 1730,
                  "end": 1742
                }
              },
              "loc": {
                "start": 1730,
                "end": 1742
              }
            },
            "loc": {
              "start": 1729,
              "end": 1743
            }
          },
          "loc": {
            "start": 1729,
            "end": 1744
          }
        },
        "directives": [],
        "loc": {
          "start": 1702,
          "end": 1744
        }
      }
    }
  },
  "directives": {
    "noDoc": "@noDoc",
    "include": "@include",
    "skip": "@skip",
    "deprecated": "@deprecated",
    "specifiedBy": "@specifiedBy"
  },
  "objects": {
    "Media": "Media",
    "Tweet": "Tweet",
    "User": "User",
    "Stat": "Stat",
    "Notification": "Notification",
    "Meta": "Meta"
  },
  "unions": {},
  "interfaces": {
    "Node": "Node"
  },
  "enums": {
    "MediaType": "MediaType"
  },
  "inputs": {
    "TweetContent": "TweetContent"
  },
  "scalars": {
    "SRI": "SRI",
    "ID": "ID",
    "String": "String",
    "Int": "Int",
    "Url": "Url",
    "Date": "Date",
    "Boolean": "Boolean"
  }
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 12`] = `
{
  "queries": {
    "allSubscription": {
      "name": "allSubscription",
      "type": "[Subscription]",
      "args": [
        {
          "name": "after",
          "type": "String",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "after",
              "loc": {
                "start": 86,
                "end": 91
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 93,
                  "end": 99
                }
              },
              "loc": {
                "start": 93,
                "end": 99
              }
            },
            "directives": [],
            "loc": {
              "start": 86,
              "end": 99
            }
          }
        },
        {
          "name": "first",
          "type": "Int",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "first",
              "loc": {
                "start": 101,
                "end": 106
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 108,
                  "end": 111
                }
              },
              "loc": {
                "start": 108,
                "end": 111
              }
            },
            "directives": [],
            "loc": {
              "start": 101,
              "end": 111
            }
          }
        },
        {
          "name": "before",
          "type": "String",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "before",
              "loc": {
                "start": 113,
                "end": 119
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 121,
                  "end": 127
                }
              },
              "loc": {
                "start": 121,
                "end": 127
              }
            },
            "directives": [],
            "loc": {
              "start": 113,
              "end": 127
            }
          }
        },
        {
          "name": "last",
          "type": "Int",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "last",
              "loc": {
                "start": 129,
                "end": 133
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 135,
                  "end": 138
                }
              },
              "loc": {
                "start": 135,
                "end": 138
              }
            },
            "directives": [],
            "loc": {
              "start": 129,
              "end": 138
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "allSubscription",
          "loc": {
            "start": 70,
            "end": 85
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "after",
              "loc": {
                "start": 86,
                "end": 91
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 93,
                  "end": 99
                }
              },
              "loc": {
                "start": 93,
                "end": 99
              }
            },
            "directives": [],
            "loc": {
              "start": 86,
              "end": 99
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "first",
              "loc": {
                "start": 101,
                "end": 106
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 108,
                  "end": 111
                }
              },
              "loc": {
                "start": 108,
                "end": 111
              }
            },
            "directives": [],
            "loc": {
              "start": 101,
              "end": 111
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "before",
              "loc": {
                "start": 113,
                "end": 119
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 121,
                  "end": 127
                }
              },
              "loc": {
                "start": 121,
                "end": 127
              }
            },
            "directives": [],
            "loc": {
              "start": 113,
              "end": 127
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "last",
              "loc": {
                "start": 129,
                "end": 133
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int",
                "loc": {
                  "start": 135,
                  "end": 138
                }
              },
              "loc": {
                "start": 135,
                "end": 138
              }
            },
            "directives": [],
            "loc": {
              "start": 129,
              "end": 138
            }
          }
        ],
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Subscription",
              "loc": {
                "start": 142,
                "end": 154
              }
            },
            "loc": {
              "start": 142,
              "end": 154
            }
          },
          "loc": {
            "start": 141,
            "end": 155
          }
        },
        "directives": [],
        "loc": {
          "start": 70,
          "end": 155
        }
      }
    },
    "subscription": {
      "name": "subscription",
      "type": "Subscription",
      "args": [
        {
          "name": "id",
          "type": "ID",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 171,
                "end": 173
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 175,
                  "end": 177
                }
              },
              "loc": {
                "start": 175,
                "end": 177
              }
            },
            "directives": [],
            "loc": {
              "start": 171,
              "end": 177
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "subscription",
          "loc": {
            "start": 158,
            "end": 170
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 171,
                "end": 173
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 175,
                  "end": 177
                }
              },
              "loc": {
                "start": 175,
                "end": 177
              }
            },
            "directives": [],
            "loc": {
              "start": 171,
              "end": 177
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Subscription",
            "loc": {
              "start": 180,
              "end": 192
            }
          },
          "loc": {
            "start": 180,
            "end": 192
          }
        },
        "directives": [],
        "loc": {
          "start": 158,
          "end": 192
        }
      }
    }
  },
  "directives": {
    "include": "@include",
    "skip": "@skip",
    "deprecated": "@deprecated",
    "specifiedBy": "@specifiedBy"
  },
  "objects": {
    "Subscription": "Subscription"
  },
  "unions": {},
  "interfaces": {},
  "enums": {},
  "inputs": {},
  "scalars": {
    "String": "String",
    "ID": "ID",
    "Int": "Int",
    "Boolean": "Boolean"
  }
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 2`] = `
{
  "createTweet": {
    "name": "createTweet",
    "type": "Tweet",
    "args": [
      {
        "name": "input",
        "type": "TweetContent",
        "deprecationReason": "Use \`content\`.",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "input",
            "loc": {
              "start": 1407,
              "end": 1412
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "loc": {
              "start": 1414,
              "end": 1426
            }
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "deprecated",
                "loc": {
                  "start": 1428,
                  "end": 1438
                }
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "reason",
                    "loc": {
                      "start": 1439,
                      "end": 1445
                    }
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "Use \`content\`.",
                    "block": false,
                    "loc": {
                      "start": 1447,
                      "end": 1463
                    }
                  },
                  "loc": {
                    "start": 1439,
                    "end": 1463
                  }
                }
              ],
              "loc": {
                "start": 1427,
                "end": 1464
              }
            }
          ],
          "loc": {
            "start": 1407,
            "end": 1464
          }
        }
      },
      {
        "name": "content",
        "type": "TweetContent",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "content",
            "loc": {
              "start": 1473,
              "end": 1480
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "loc": {
              "start": 1482,
              "end": 1494
            }
          },
          "directives": [],
          "loc": {
            "start": 1473,
            "end": 1494
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "createTweet",
        "loc": {
          "start": 1385,
          "end": 1396
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "input",
            "loc": {
              "start": 1407,
              "end": 1412
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "loc": {
              "start": 1414,
              "end": 1426
            }
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "deprecated",
                "loc": {
                  "start": 1428,
                  "end": 1438
                }
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "reason",
                    "loc": {
                      "start": 1439,
                      "end": 1445
                    }
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "Use \`content\`.",
                    "block": false,
                    "loc": {
                      "start": 1447,
                      "end": 1463
                    }
                  },
                  "loc": {
                    "start": 1439,
                    "end": 1463
                  }
                }
              ],
              "loc": {
                "start": 1427,
                "end": 1464
              }
            }
          ],
          "loc": {
            "start": 1407,
            "end": 1464
          }
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "content",
            "loc": {
              "start": 1473,
              "end": 1480
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "loc": {
              "start": 1482,
              "end": 1494
            }
          },
          "directives": [],
          "loc": {
            "start": 1473,
            "end": 1494
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1502,
            "end": 1507
          }
        },
        "loc": {
          "start": 1502,
          "end": 1507
        }
      },
      "directives": [],
      "loc": {
        "start": 1385,
        "end": 1507
      }
    }
  },
  "deleteTweet": {
    "name": "deleteTweet",
    "type": "Tweet",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1524,
              "end": 1526
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1530
              }
            },
            "loc": {
              "start": 1528,
              "end": 1531
            }
          },
          "directives": [],
          "loc": {
            "start": 1524,
            "end": 1531
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "deleteTweet",
        "loc": {
          "start": 1512,
          "end": 1523
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1524,
              "end": 1526
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1530
              }
            },
            "loc": {
              "start": 1528,
              "end": 1531
            }
          },
          "directives": [],
          "loc": {
            "start": 1524,
            "end": 1531
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1534,
            "end": 1539
          }
        },
        "loc": {
          "start": 1534,
          "end": 1539
        }
      },
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "noDoc",
            "loc": {
              "start": 1541,
              "end": 1546
            }
          },
          "arguments": [],
          "loc": {
            "start": 1540,
            "end": 1546
          }
        }
      ],
      "loc": {
        "start": 1512,
        "end": 1546
      }
    }
  },
  "markTweetRead": {
    "name": "markTweetRead",
    "type": "Boolean",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1565,
              "end": 1567
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1571
              }
            },
            "loc": {
              "start": 1569,
              "end": 1572
            }
          },
          "directives": [],
          "loc": {
            "start": 1565,
            "end": 1572
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "markTweetRead",
        "loc": {
          "start": 1551,
          "end": 1564
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1565,
              "end": 1567
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1571
              }
            },
            "loc": {
              "start": 1569,
              "end": 1572
            }
          },
          "directives": [],
          "loc": {
            "start": 1565,
            "end": 1572
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean",
          "loc": {
            "start": 1575,
            "end": 1582
          }
        },
        "loc": {
          "start": 1575,
          "end": 1582
        }
      },
      "directives": [],
      "loc": {
        "start": 1551,
        "end": 1582
      }
    }
  }
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 3`] = `
{
  "Notifications": {
    "name": "Notifications",
    "type": "[Notification]!",
    "args": [
      {
        "name": "limit",
        "type": "Int",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "limit",
            "loc": {
              "start": 1716,
              "end": 1721
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1723,
                "end": 1726
              }
            },
            "loc": {
              "start": 1723,
              "end": 1726
            }
          },
          "directives": [],
          "loc": {
            "start": 1716,
            "end": 1726
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "Notifications",
        "loc": {
          "start": 1702,
          "end": 1715
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "limit",
            "loc": {
              "start": 1716,
              "end": 1721
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int",
              "loc": {
                "start": 1723,
                "end": 1726
              }
            },
            "loc": {
              "start": 1723,
              "end": 1726
            }
          },
          "directives": [],
          "loc": {
            "start": 1716,
            "end": 1726
          }
        }
      ],
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Notification",
              "loc": {
                "start": 1730,
                "end": 1742
              }
            },
            "loc": {
              "start": 1730,
              "end": 1742
            }
          },
          "loc": {
            "start": 1729,
            "end": 1743
          }
        },
        "loc": {
          "start": 1729,
          "end": 1744
        }
      },
      "directives": [],
      "loc": {
        "start": 1702,
        "end": 1744
      }
    }
  }
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 4`] = `
[
  {
    "name": "createTweet",
    "type": "Tweet",
    "args": [
      {
        "name": "input",
        "type": "TweetContent",
        "deprecationReason": "Use \`content\`.",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "input",
            "loc": {
              "start": 1407,
              "end": 1412
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "loc": {
              "start": 1414,
              "end": 1426
            }
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "deprecated",
                "loc": {
                  "start": 1428,
                  "end": 1438
                }
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "reason",
                    "loc": {
                      "start": 1439,
                      "end": 1445
                    }
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "Use \`content\`.",
                    "block": false,
                    "loc": {
                      "start": 1447,
                      "end": 1463
                    }
                  },
                  "loc": {
                    "start": 1439,
                    "end": 1463
                  }
                }
              ],
              "loc": {
                "start": 1427,
                "end": 1464
              }
            }
          ],
          "loc": {
            "start": 1407,
            "end": 1464
          }
        }
      },
      {
        "name": "content",
        "type": "TweetContent",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "content",
            "loc": {
              "start": 1473,
              "end": 1480
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "loc": {
              "start": 1482,
              "end": 1494
            }
          },
          "directives": [],
          "loc": {
            "start": 1473,
            "end": 1494
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "createTweet",
        "loc": {
          "start": 1385,
          "end": 1396
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "input",
            "loc": {
              "start": 1407,
              "end": 1412
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1414,
                "end": 1426
              }
            },
            "loc": {
              "start": 1414,
              "end": 1426
            }
          },
          "directives": [
            {
              "kind": "Directive",
              "name": {
                "kind": "Name",
                "value": "deprecated",
                "loc": {
                  "start": 1428,
                  "end": 1438
                }
              },
              "arguments": [
                {
                  "kind": "Argument",
                  "name": {
                    "kind": "Name",
                    "value": "reason",
                    "loc": {
                      "start": 1439,
                      "end": 1445
                    }
                  },
                  "value": {
                    "kind": "StringValue",
                    "value": "Use \`content\`.",
                    "block": false,
                    "loc": {
                      "start": 1447,
                      "end": 1463
                    }
                  },
                  "loc": {
                    "start": 1439,
                    "end": 1463
                  }
                }
              ],
              "loc": {
                "start": 1427,
                "end": 1464
              }
            }
          ],
          "loc": {
            "start": 1407,
            "end": 1464
          }
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "content",
            "loc": {
              "start": 1473,
              "end": 1480
            }
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "TweetContent",
              "loc": {
                "start": 1482,
                "end": 1494
              }
            },
            "loc": {
              "start": 1482,
              "end": 1494
            }
          },
          "directives": [],
          "loc": {
            "start": 1473,
            "end": 1494
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1502,
            "end": 1507
          }
        },
        "loc": {
          "start": 1502,
          "end": 1507
        }
      },
      "directives": [],
      "loc": {
        "start": 1385,
        "end": 1507
      }
    }
  },
  {
    "name": "deleteTweet",
    "type": "Tweet",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1524,
              "end": 1526
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1530
              }
            },
            "loc": {
              "start": 1528,
              "end": 1531
            }
          },
          "directives": [],
          "loc": {
            "start": 1524,
            "end": 1531
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "deleteTweet",
        "loc": {
          "start": 1512,
          "end": 1523
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1524,
              "end": 1526
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1528,
                  "end": 1530
                }
              },
              "loc": {
                "start": 1528,
                "end": 1530
              }
            },
            "loc": {
              "start": 1528,
              "end": 1531
            }
          },
          "directives": [],
          "loc": {
            "start": 1524,
            "end": 1531
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Tweet",
          "loc": {
            "start": 1534,
            "end": 1539
          }
        },
        "loc": {
          "start": 1534,
          "end": 1539
        }
      },
      "directives": [
        {
          "kind": "Directive",
          "name": {
            "kind": "Name",
            "value": "noDoc",
            "loc": {
              "start": 1541,
              "end": 1546
            }
          },
          "arguments": [],
          "loc": {
            "start": 1540,
            "end": 1546
          }
        }
      ],
      "loc": {
        "start": 1512,
        "end": 1546
      }
    }
  },
  {
    "name": "markTweetRead",
    "type": "Boolean",
    "args": [
      {
        "name": "id",
        "type": "ID!",
        "extensions": {},
        "astNode": {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1565,
              "end": 1567
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1571
              }
            },
            "loc": {
              "start": 1569,
              "end": 1572
            }
          },
          "directives": [],
          "loc": {
            "start": 1565,
            "end": 1572
          }
        }
      }
    ],
    "extensions": {},
    "astNode": {
      "kind": "FieldDefinition",
      "name": {
        "kind": "Name",
        "value": "markTweetRead",
        "loc": {
          "start": 1551,
          "end": 1564
        }
      },
      "arguments": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id",
            "loc": {
              "start": 1565,
              "end": 1567
            }
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID",
                "loc": {
                  "start": 1569,
                  "end": 1571
                }
              },
              "loc": {
                "start": 1569,
                "end": 1571
              }
            },
            "loc": {
              "start": 1569,
              "end": 1572
            }
          },
          "directives": [],
          "loc": {
            "start": 1565,
            "end": 1572
          }
        }
      ],
      "type": {
        "kind": "NamedType",
        "name": {
          "kind": "Name",
          "value": "Boolean",
          "loc": {
            "start": 1575,
            "end": 1582
          }
        },
        "loc": {
          "start": 1575,
          "end": 1582
        }
      },
      "directives": [],
      "loc": {
        "start": 1551,
        "end": 1582
      }
    }
  }
]
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 5`] = `
{
  "Media": "Media",
  "Tweet": "Tweet",
  "User": "User",
  "Stat": "Stat",
  "Notification": "Notification",
  "Meta": "Meta"
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 6`] = `
{}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 7`] = `
{
  "Node": "Node"
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 8`] = `
{
  "MediaType": "MediaType"
}
`

exports[`tests/unit/graphql.test.ts TAP > must match snapshot 9`] = `
{
  "TweetContent": "TweetContent"
}
`
