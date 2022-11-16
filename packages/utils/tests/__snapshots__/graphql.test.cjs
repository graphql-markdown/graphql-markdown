/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLEnumType 1`] = `
{
  "MediaType": "MediaType"
}
`

exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLInputObjectType 1`] = `
{
  "TweetContent": "TweetContent"
}
`

exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLInterfaceType 1`] = `
{
  "Node": "Node"
}
`

exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLObjectType 1`] = `
{
  "Media": "Media",
  "Tweet": "Tweet",
  "User": "User",
  "Stat": "Stat",
  "Notification": "Notification",
  "Meta": "Meta"
}
`

exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLScalarType 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns a filter map filtered by GraphQLUnionType 1`] = `
{}
`

exports[`tests/unit/graphql.test.ts TAP > returns implementations compatible with type 1`] = `
{
  "objects": [
    "Dog",
    "Cat"
  ],
  "interfaces": [
    "Canine"
  ],
  "unions": [
    "Pet"
  ]
}
`

exports[`tests/unit/graphql.test.ts TAP > returns list of mutations 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns list of queries 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns list of subscriptions 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns list of type fields 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns queries, subscriptions and mutations using a type 1`] = `
{
  "queries": [
    {
      "name": "getStudyItems",
      "type": "[StudyItem!]",
      "args": [
        {
          "name": "subject",
          "type": "String",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 124,
                "end": 131
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 133,
                  "end": 139
                }
              },
              "loc": {
                "start": 133,
                "end": 139
              }
            },
            "directives": [],
            "loc": {
              "start": 124,
              "end": 139
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "getStudyItems",
          "loc": {
            "start": 110,
            "end": 123
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 124,
                "end": 131
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 133,
                  "end": 139
                }
              },
              "loc": {
                "start": 133,
                "end": 139
              }
            },
            "directives": [],
            "loc": {
              "start": 124,
              "end": 139
            }
          }
        ],
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "StudyItem",
                "loc": {
                  "start": 143,
                  "end": 152
                }
              },
              "loc": {
                "start": 143,
                "end": 152
              }
            },
            "loc": {
              "start": 143,
              "end": 153
            }
          },
          "loc": {
            "start": 142,
            "end": 154
          }
        },
        "directives": [],
        "loc": {
          "start": 110,
          "end": 154
        }
      }
    },
    {
      "name": "getStudyItem",
      "type": "StudyItem",
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
                "start": 174,
                "end": 176
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
                    "start": 178,
                    "end": 180
                  }
                },
                "loc": {
                  "start": 178,
                  "end": 180
                }
              },
              "loc": {
                "start": 178,
                "end": 181
              }
            },
            "directives": [],
            "loc": {
              "start": 174,
              "end": 181
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "getStudyItem",
          "loc": {
            "start": 161,
            "end": 173
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 174,
                "end": 176
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
                    "start": 178,
                    "end": 180
                  }
                },
                "loc": {
                  "start": 178,
                  "end": 180
                }
              },
              "loc": {
                "start": 178,
                "end": 181
              }
            },
            "directives": [],
            "loc": {
              "start": 174,
              "end": 181
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "StudyItem",
            "loc": {
              "start": 184,
              "end": 193
            }
          },
          "loc": {
            "start": 184,
            "end": 193
          }
        },
        "directives": [],
        "loc": {
          "start": 161,
          "end": 193
        }
      }
    }
  ],
  "mutations": [
    {
      "name": "addStudyItem",
      "type": "StudyItem",
      "args": [
        {
          "name": "subject",
          "type": "String!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 240,
                "end": 247
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 249,
                    "end": 255
                  }
                },
                "loc": {
                  "start": 249,
                  "end": 255
                }
              },
              "loc": {
                "start": 249,
                "end": 256
              }
            },
            "directives": [],
            "loc": {
              "start": 240,
              "end": 256
            }
          }
        },
        {
          "name": "duration",
          "type": "Int!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "duration",
              "loc": {
                "start": 258,
                "end": 266
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int",
                  "loc": {
                    "start": 268,
                    "end": 271
                  }
                },
                "loc": {
                  "start": 268,
                  "end": 271
                }
              },
              "loc": {
                "start": 268,
                "end": 272
              }
            },
            "directives": [],
            "loc": {
              "start": 258,
              "end": 272
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "addStudyItem",
          "loc": {
            "start": 227,
            "end": 239
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 240,
                "end": 247
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 249,
                    "end": 255
                  }
                },
                "loc": {
                  "start": 249,
                  "end": 255
                }
              },
              "loc": {
                "start": 249,
                "end": 256
              }
            },
            "directives": [],
            "loc": {
              "start": 240,
              "end": 256
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "duration",
              "loc": {
                "start": 258,
                "end": 266
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int",
                  "loc": {
                    "start": 268,
                    "end": 271
                  }
                },
                "loc": {
                  "start": 268,
                  "end": 271
                }
              },
              "loc": {
                "start": 268,
                "end": 272
              }
            },
            "directives": [],
            "loc": {
              "start": 258,
              "end": 272
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "StudyItem",
            "loc": {
              "start": 275,
              "end": 284
            }
          },
          "loc": {
            "start": 275,
            "end": 284
          }
        },
        "directives": [],
        "loc": {
          "start": 227,
          "end": 284
        }
      }
    }
  ],
  "subscriptions": [
    {
      "name": "listStudyItems",
      "type": "[StudyItem!]",
      "args": [],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "listStudyItems",
          "loc": {
            "start": 322,
            "end": 336
          }
        },
        "arguments": [],
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "StudyItem",
                "loc": {
                  "start": 339,
                  "end": 348
                }
              },
              "loc": {
                "start": 339,
                "end": 348
              }
            },
            "loc": {
              "start": 339,
              "end": 349
            }
          },
          "loc": {
            "start": 338,
            "end": 350
          }
        },
        "directives": [],
        "loc": {
          "start": 322,
          "end": 350
        }
      }
    }
  ]
}
`

exports[`tests/unit/graphql.test.ts TAP > returns queries, subscriptions and mutations using a type as field 1`] = `
{
  "queries": [
    {
      "name": "getStudyItems",
      "type": "[StudyItem!]",
      "args": [
        {
          "name": "subject",
          "type": "String",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 194,
                "end": 201
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 203,
                  "end": 209
                }
              },
              "loc": {
                "start": 203,
                "end": 209
              }
            },
            "directives": [],
            "loc": {
              "start": 194,
              "end": 209
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "getStudyItems",
          "loc": {
            "start": 180,
            "end": 193
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 194,
                "end": 201
              }
            },
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String",
                "loc": {
                  "start": 203,
                  "end": 209
                }
              },
              "loc": {
                "start": 203,
                "end": 209
              }
            },
            "directives": [],
            "loc": {
              "start": 194,
              "end": 209
            }
          }
        ],
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "StudyItem",
                "loc": {
                  "start": 213,
                  "end": 222
                }
              },
              "loc": {
                "start": 213,
                "end": 222
              }
            },
            "loc": {
              "start": 213,
              "end": 223
            }
          },
          "loc": {
            "start": 212,
            "end": 224
          }
        },
        "directives": [],
        "loc": {
          "start": 180,
          "end": 224
        }
      }
    },
    {
      "name": "getStudyItem",
      "type": "StudyItem",
      "args": [
        {
          "name": "id",
          "type": "String!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 244,
                "end": 246
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 248,
                    "end": 254
                  }
                },
                "loc": {
                  "start": 248,
                  "end": 254
                }
              },
              "loc": {
                "start": 248,
                "end": 255
              }
            },
            "directives": [],
            "loc": {
              "start": 244,
              "end": 255
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "getStudyItem",
          "loc": {
            "start": 231,
            "end": 243
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "id",
              "loc": {
                "start": 244,
                "end": 246
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 248,
                    "end": 254
                  }
                },
                "loc": {
                  "start": 248,
                  "end": 254
                }
              },
              "loc": {
                "start": 248,
                "end": 255
              }
            },
            "directives": [],
            "loc": {
              "start": 244,
              "end": 255
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "StudyItem",
            "loc": {
              "start": 258,
              "end": 267
            }
          },
          "loc": {
            "start": 258,
            "end": 267
          }
        },
        "directives": [],
        "loc": {
          "start": 231,
          "end": 267
        }
      }
    }
  ],
  "mutations": [
    {
      "name": "addStudyItem",
      "type": "StudyItem",
      "args": [
        {
          "name": "subject",
          "type": "String!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 314,
                "end": 321
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 323,
                    "end": 329
                  }
                },
                "loc": {
                  "start": 323,
                  "end": 329
                }
              },
              "loc": {
                "start": 323,
                "end": 330
              }
            },
            "directives": [],
            "loc": {
              "start": 314,
              "end": 330
            }
          }
        },
        {
          "name": "duration",
          "type": "Int!",
          "extensions": {},
          "astNode": {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "duration",
              "loc": {
                "start": 332,
                "end": 340
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int",
                  "loc": {
                    "start": 342,
                    "end": 345
                  }
                },
                "loc": {
                  "start": 342,
                  "end": 345
                }
              },
              "loc": {
                "start": 342,
                "end": 346
              }
            },
            "directives": [],
            "loc": {
              "start": 332,
              "end": 346
            }
          }
        }
      ],
      "extensions": {},
      "astNode": {
        "kind": "FieldDefinition",
        "name": {
          "kind": "Name",
          "value": "addStudyItem",
          "loc": {
            "start": 301,
            "end": 313
          }
        },
        "arguments": [
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "subject",
              "loc": {
                "start": 314,
                "end": 321
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "String",
                  "loc": {
                    "start": 323,
                    "end": 329
                  }
                },
                "loc": {
                  "start": 323,
                  "end": 329
                }
              },
              "loc": {
                "start": 323,
                "end": 330
              }
            },
            "directives": [],
            "loc": {
              "start": 314,
              "end": 330
            }
          },
          {
            "kind": "InputValueDefinition",
            "name": {
              "kind": "Name",
              "value": "duration",
              "loc": {
                "start": 332,
                "end": 340
              }
            },
            "type": {
              "kind": "NonNullType",
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int",
                  "loc": {
                    "start": 342,
                    "end": 345
                  }
                },
                "loc": {
                  "start": 342,
                  "end": 345
                }
              },
              "loc": {
                "start": 342,
                "end": 346
              }
            },
            "directives": [],
            "loc": {
              "start": 332,
              "end": 346
            }
          }
        ],
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "StudyItem",
            "loc": {
              "start": 349,
              "end": 358
            }
          },
          "loc": {
            "start": 349,
            "end": 358
          }
        },
        "directives": [],
        "loc": {
          "start": 301,
          "end": 358
        }
      }
    }
  ],
  "subscriptions": [],
  "objects": [
    "StudyItem"
  ],
  "interfaces": [
    "Record"
  ],
  "inputs": [],
  "directives": [
    "@deprecated",
    "@specifiedBy"
  ]
}
`

exports[`tests/unit/graphql.test.ts TAP > returns schema types map 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns schema types map with custom root types 1`] = `
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

exports[`tests/unit/graphql.test.ts TAP > returns types and interfaces extending an interface 1`] = `
{
  "objects": [
    "Dog"
  ],
  "interfaces": [
    "Canine"
  ]
}
`

exports[`tests/unit/graphql.test.ts TAP > returns unions using a type 1`] = `
{
  "unions": [
    "Task"
  ]
}
`
