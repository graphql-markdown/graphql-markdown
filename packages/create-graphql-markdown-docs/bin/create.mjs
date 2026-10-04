#!/usr/bin/env node

import { run } from "../lib/create.mjs";

process.exitCode = await run();
